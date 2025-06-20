import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { E2EECrypto } from '@/utils/crypto';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface ChatRoom {
  id: string;
  name?: string;
  room_type: 'direct' | 'group' | 'channel';
  avatar_url?: string;
  is_encrypted: boolean;
  created_at: string;
  member_count?: number;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}

interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  message_type: 'text' | 'image' | 'file' | 'voice' | 'video' | 'reaction' | 'reply' | 'system';
  content: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  file_type?: string;
  reply_to?: string;
  is_edited: boolean;
  is_deleted: boolean;
  created_at: string;
  sender_name?: string;
  reactions?: MessageReaction[];
}

interface MessageReaction {
  id: string;
  emoji: string;
  user_id: string;
  user_name?: string;
}

interface UserPresence {
  user_id: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  last_seen: string;
  is_typing: boolean;
  typing_in_room?: string;
  custom_status?: string;
}

export const useEnhancedE2EE = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userPresence, setUserPresence] = useState<Map<string, UserPresence>>(new Map());
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [sharedKeys, setSharedKeys] = useState<Map<string, CryptoKey>>(new Map());
  const [loading, setLoading] = useState(true);

  // Initialize user's key pair
  useEffect(() => {
    const initializeKeys = async () => {
      if (!user) return;

      try {
        const { data: existingKey } = await supabase
          .from('user_key_pairs')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingKey) {
          const privateKeyData = new Uint8Array(existingKey.private_key);
          const publicKeyData = new Uint8Array(existingKey.public_key);
          
          const privateKey = await crypto.subtle.importKey(
            'pkcs8',
            privateKeyData,
            { name: 'ECDH', namedCurve: 'P-256' },
            true,
            ['deriveKey', 'deriveBits']
          );
          
          const publicKey = await E2EECrypto.importPublicKey(publicKeyData);
          setKeyPair({ privateKey, publicKey });
        } else {
          const newKeyPair = await E2EECrypto.generateKeyPair();
          const publicKeyData = await E2EECrypto.exportPublicKey(newKeyPair);
          const privateKeyData = await crypto.subtle.exportKey('pkcs8', newKeyPair.privateKey);

          await supabase.from('user_key_pairs').insert({
            user_id: user.id,
            public_key: Array.from(new Uint8Array(publicKeyData)),
            private_key: Array.from(new Uint8Array(privateKeyData))
          });

          setKeyPair(newKeyPair);
        }
      } catch (error) {
        console.error('Error initializing keys:', error);
        toast({
          title: "Encryption Error",
          description: "Failed to initialize encryption keys",
          variant: "destructive"
        });
      }
      setLoading(false);
    };

    initializeKeys();
  }, [user, toast]);

  // Load user's chat rooms with enhanced error handling
  const loadRooms = useCallback(async () => {
    if (!user) return;

    try {
      const { data: roomsData, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          room_members!inner(user_id, role),
          messages(
            id,
            encrypted_content,
            created_at
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading rooms:', error);
        toast({
          title: "Load Error",
          description: "Failed to load chat rooms",
          variant: "destructive"
        });
        return;
      }

      if (roomsData) {
        const processedRooms: ChatRoom[] = roomsData.map(room => ({
          id: room.id,
          name: room.name,
          room_type: room.room_type,
          avatar_url: room.avatar_url,
          is_encrypted: room.is_encrypted,
          created_at: room.created_at,
          member_count: room.room_members?.length || 0,
          last_message: room.messages?.[0] ? 'Encrypted message' : undefined,
          last_message_at: room.messages?.[0]?.created_at,
          unread_count: 0 // TODO: Calculate actual unread count
        }));

        setRooms(processedRooms);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat backend",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Load messages for a room
  const loadMessages = useCallback(async (roomId: string) => {
    if (!user || !keyPair) return;

    try {
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id(full_name),
          message_reactions(id, emoji, user_id, profiles:user_id(full_name))
        `)
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });

      if (messagesData) {
        const decryptedMessages: Message[] = [];

        for (const msg of messagesData) {
          try {
            // Get shared key for sender
            let sharedKey = sharedKeys.get(msg.sender_id);
            
            if (!sharedKey) {
              const { data: senderKeyData } = await supabase
                .from('user_key_pairs')
                .select('public_key')
                .eq('user_id', msg.sender_id)
                .single();

              if (senderKeyData) {
                const senderPublicKey = await E2EECrypto.importPublicKey(
                  new Uint8Array(senderKeyData.public_key).buffer
                );
                sharedKey = await E2EECrypto.deriveSharedKey(keyPair.privateKey, senderPublicKey);
                setSharedKeys(prev => new Map(prev).set(msg.sender_id, sharedKey!));
              }
            }

            if (sharedKey) {
              const encryptedData = new Uint8Array(msg.encrypted_content).buffer;
              const iv = new Uint8Array(msg.iv);
              
              const decryptedContent = await E2EECrypto.decryptMessage(
                encryptedData,
                sharedKey,
                iv
              );

              decryptedMessages.push({
                id: msg.id,
                room_id: msg.room_id,
                sender_id: msg.sender_id,
                message_type: msg.message_type,
                content: decryptedContent,
                file_url: msg.file_url,
                file_name: msg.file_name,
                file_size: msg.file_size,
                file_type: msg.file_type,
                reply_to: msg.reply_to,
                is_edited: msg.is_edited,
                is_deleted: msg.is_deleted,
                created_at: msg.created_at,
                sender_name: (msg.profiles as any)?.full_name,
                reactions: msg.message_reactions?.map((reaction: any) => ({
                  id: reaction.id,
                  emoji: reaction.emoji,
                  user_id: reaction.user_id,
                  user_name: reaction.profiles?.full_name
                })) || []
              });
            }
          } catch (error) {
            console.error('Error decrypting message:', error);
          }
        }

        setMessages(decryptedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [user, keyPair, sharedKeys]);

  // Enhanced send message with better error handling
  const sendMessage = useCallback(async (
    roomId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'file' | 'voice' | 'video' = 'text',
    replyTo?: string,
    fileData?: { url: string; name: string; size: number; type: string }
  ) => {
    if (!user || !keyPair || !content.trim()) return;

    try {
      // Enhanced room member validation
      const { data: roomMembers, error: membersError } = await supabase
        .from('room_members')
        .select('user_id, room_id')
        .eq('room_id', roomId)
        .neq('user_id', user.id);

      if (membersError) {
        throw new Error(`Failed to get room members: ${membersError.message}`);
      }

      if (!roomMembers || roomMembers.length === 0) {
        throw new Error('No recipients found in this room');
      }

      // For simplicity, using the first other member's key for direct messages
      const recipientId = roomMembers[0].user_id;
      
      let sharedKey = sharedKeys.get(recipientId);
      if (!sharedKey) {
        const { data: recipientKeyData, error: keyError } = await supabase
          .from('user_key_pairs')
          .select('public_key')
          .eq('user_id', recipientId)
          .single();

        if (keyError) {
          throw new Error(`Failed to get recipient key: ${keyError.message}`);
        }

        if (recipientKeyData) {
          const recipientPublicKey = await E2EECrypto.importPublicKey(
            new Uint8Array(recipientKeyData.public_key).buffer
          );
          sharedKey = await E2EECrypto.deriveSharedKey(keyPair.privateKey, recipientPublicKey);
          setSharedKeys(prev => new Map(prev).set(recipientId, sharedKey!));
        }
      }

      if (!sharedKey) throw new Error('Could not establish shared key');

      // Encrypt message with enhanced security
      const { encryptedData, iv } = await E2EECrypto.encryptMessage(content, sharedKey);
      const mac = await E2EECrypto.generateMAC(content, sharedKey);

      // Send encrypted message with metadata
      const { error: insertError } = await supabase.from('messages').insert({
        room_id: roomId,
        sender_id: user.id,
        message_type: messageType,
        encrypted_content: Array.from(new Uint8Array(encryptedData)),
        iv: Array.from(iv),
        mac: Array.from(new Uint8Array(mac)),
        reply_to: replyTo,
        file_url: fileData?.url,
        file_name: fileData?.name,
        file_size: fileData?.size,
        file_type: fileData?.type,
        metadata: {
          client_version: '1.0.0',
          encryption_method: 'ECDH-AES-256-GCM',
          timestamp: new Date().toISOString()
        }
      });

      if (insertError) {
        throw new Error(`Failed to send message: ${insertError.message}`);
      }

      // Update room's last activity
      await supabase
        .from('chat_rooms')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', roomId);

      toast({
        title: "Message Sent",
        description: "Your encrypted message has been delivered",
      });

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Failed",
        description: error instanceof Error ? error.message : "Failed to send encrypted message",
        variant: "destructive"
      });
      throw error;
    }
  }, [user, keyPair, sharedKeys, toast]);

  // Create or get direct message room
  const createDirectMessageRoom = useCallback(async (recipientId: string) => {
    if (!user) return null;

    try {
      const { data: roomId } = await supabase.rpc('create_direct_message_room', {
        recipient_id: recipientId
      });

      if (roomId) {
        await loadRooms();
        return roomId;
      }
    } catch (error) {
      console.error('Error creating DM room:', error);
    }
    return null;
  }, [user, loadRooms]);

  // Enhanced add reaction with error handling
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('message_reactions').upsert({
        message_id: messageId,
        user_id: user.id,
        emoji
      }, {
        onConflict: 'message_id,user_id,emoji'
      });

      if (error) {
        throw new Error(`Failed to add reaction: ${error.message}`);
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Reaction Failed",
        description: "Failed to add reaction",
        variant: "destructive"
      });
    }
  }, [user, toast]);

  // Enhanced update presence with validation
  const updatePresence = useCallback(async (
    status: 'online' | 'offline' | 'away' | 'busy',
    customStatus?: string,
    typingInRoom?: string
  ) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('user_presence').upsert({
        user_id: user.id,
        status,
        custom_status: customStatus,
        typing_in_room: typingInRoom,
        is_typing: !!typingInRoom,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error('Error updating presence:', error);
      }
    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [user]);

  // Enhanced real-time subscriptions with error handling
  useEffect(() => {
    if (!user) return;

    const channels: any[] = [];

    try {
      // Subscribe to room changes
      const roomsChannel = supabase
        .channel('rooms-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'chat_rooms'
        }, (payload) => {
          console.log('Room change:', payload);
          loadRooms();
        })
        .subscribe((status) => {
          console.log('Rooms channel status:', status);
        });

      // Subscribe to message changes
      const messagesChannel = supabase
        .channel('messages-changes')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        }, (payload) => {
          console.log('New message:', payload);
          if (currentRoom) {
            loadMessages(currentRoom.id);
          }
        })
        .subscribe((status) => {
          console.log('Messages channel status:', status);
        });

      // Subscribe to presence changes
      const presenceChannel = supabase
        .channel('presence-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_presence'
        }, (payload) => {
          console.log('Presence change:', payload);
          const presence = payload.new as UserPresence;
          setUserPresence(prev => new Map(prev).set(presence.user_id, presence));
        })
        .subscribe((status) => {
          console.log('Presence channel status:', status);
        });

      channels.push(roomsChannel, messagesChannel, presenceChannel);

    } catch (error) {
      console.error('Error setting up real-time subscriptions:', error);
      toast({
        title: "Connection Error",
        description: "Failed to establish real-time connection",
        variant: "destructive"
      });
    }

    return () => {
      channels.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      });
    };
  }, [user, currentRoom, loadRooms, loadMessages, toast]);

  // Load initial data
  useEffect(() => {
    if (user && keyPair) {
      loadRooms();
      updatePresence('online');
    }
  }, [user, keyPair, loadRooms, updatePresence]);

  // Load messages when room changes
  useEffect(() => {
    if (currentRoom) {
      loadMessages(currentRoom.id);
    }
  }, [currentRoom, loadMessages]);

  return {
    rooms,
    currentRoom,
    setCurrentRoom,
    messages,
    userPresence,
    loading,
    sendMessage,
    createDirectMessageRoom,
    addReaction,
    updatePresence,
    keyPair: !!keyPair
  };
};
