
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { E2EECrypto } from '@/utils/crypto';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface ChatMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  encrypted_content: string;
  iv: string;
  mac: string;
  created_at: string;
  sender_public_key?: string;
}

interface DecryptedMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  sender_name?: string;
}

export const useE2EEChat = (recipientId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<DecryptedMessage[]>([]);
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [sharedKeys, setSharedKeys] = useState<Map<string, CryptoKey>>(new Map());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Initialize user's key pair
  useEffect(() => {
    const initializeKeys = async () => {
      if (!user) return;

      try {
        // Check if user already has a key pair stored
        const { data: existingKey } = await supabase
          .from('user_key_pairs')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (existingKey) {
          // Import existing key pair
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
          // Generate new key pair
          const newKeyPair = await E2EECrypto.generateKeyPair();
          const publicKeyData = await E2EECrypto.exportPublicKey(newKeyPair);
          const privateKeyData = await crypto.subtle.exportKey('pkcs8', newKeyPair.privateKey);

          // Store key pair in database
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

  // Load and decrypt messages
  const loadMessages = useCallback(async () => {
    if (!user || !recipientId || !keyPair) return;

    try {
      const { data: chatMessages } = await supabase
        .from('encrypted_messages')
        .select(`
          *,
          profiles:sender_id(full_name)
        `)
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (chatMessages) {
        const decryptedMessages: DecryptedMessage[] = [];

        for (const msg of chatMessages) {
          try {
            let sharedKey = sharedKeys.get(msg.sender_id);
            
            if (!sharedKey) {
              // Get sender's public key and derive shared key
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
                sender_id: msg.sender_id,
                recipient_id: msg.recipient_id,
                content: decryptedContent,
                created_at: msg.created_at,
                sender_name: msg.profiles?.full_name
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
  }, [user, recipientId, keyPair, sharedKeys]);

  // Send encrypted message
  const sendMessage = useCallback(async (content: string) => {
    if (!user || !recipientId || !keyPair || !content.trim()) return;

    setSending(true);
    try {
      // Get recipient's public key
      const { data: recipientKeyData } = await supabase
        .from('user_key_pairs')
        .select('public_key')
        .eq('user_id', recipientId)
        .single();

      if (!recipientKeyData) {
        throw new Error('Recipient public key not found');
      }

      // Derive shared key
      let sharedKey = sharedKeys.get(recipientId);
      if (!sharedKey) {
        const recipientPublicKey = await E2EECrypto.importPublicKey(
          new Uint8Array(recipientKeyData.public_key).buffer
        );
        sharedKey = await E2EECrypto.deriveSharedKey(keyPair.privateKey, recipientPublicKey);
        setSharedKeys(prev => new Map(prev).set(recipientId, sharedKey!));
      }

      // Encrypt message
      const { encryptedData, iv } = await E2EECrypto.encryptMessage(content, sharedKey);
      const mac = await E2EECrypto.generateMAC(content, sharedKey);

      // Send encrypted message
      await supabase.from('encrypted_messages').insert({
        sender_id: user.id,
        recipient_id: recipientId,
        encrypted_content: Array.from(new Uint8Array(encryptedData)),
        iv: Array.from(iv),
        mac: Array.from(new Uint8Array(mac))
      });

      toast({
        title: "Message Sent",
        description: "Your encrypted message has been delivered",
      });

      // Reload messages to show the new one
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send encrypted message",
        variant: "destructive"
      });
    }
    setSending(false);
  }, [user, recipientId, keyPair, sharedKeys, loadMessages, toast]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user || !recipientId) return;

    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'encrypted_messages',
          filter: `or(and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id}))`
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, recipientId, loadMessages]);

  // Load messages when dependencies change
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    sendMessage,
    loading,
    sending,
    keyPair: keyPair ? true : false
  };
};
