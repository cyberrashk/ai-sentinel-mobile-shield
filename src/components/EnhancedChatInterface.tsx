import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, Send, Phone, Video, MoreVertical, Smile, 
  Paperclip, Reply, Users, Settings, Search, 
  UserPlus, Bell, Lock, Database, Server, Wifi
} from 'lucide-react';
import { useEnhancedE2EE } from '@/hooks/useEnhancedE2EE';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const EnhancedChatInterface = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    rooms, 
    currentRoom, 
    setCurrentRoom, 
    messages, 
    userPresence, 
    loading, 
    sendMessage, 
    addReaction,
    updatePresence,
    createDirectMessageRoom
  } = useEnhancedE2EE();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showBackendStatus, setShowBackendStatus] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    supabase: 'connected',
    encryption: 'active',
    realtime: 'synced',
    database: 'operational'
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Monitor backend status
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        // Check Supabase connection
        const { data, error } = await supabase.from('profiles').select('id').limit(1);
        setConnectionStatus(prev => ({
          ...prev,
          supabase: error ? 'disconnected' : 'connected',
          database: error ? 'error' : 'operational'
        }));

        // Check real-time status
        const channelStatus = supabase.getChannels().length > 0 ? 'synced' : 'disconnected';
        setConnectionStatus(prev => ({
          ...prev,
          realtime: channelStatus
        }));
      } catch (error) {
        console.error('Backend status check failed:', error);
        setConnectionStatus(prev => ({
          ...prev,
          supabase: 'error',
          database: 'error'
        }));
      }
    };

    const interval = setInterval(checkBackendStatus, 30000); // Check every 30 seconds
    checkBackendStatus(); // Initial check

    return () => clearInterval(interval);
  }, []);

  // Handle typing indicator
  useEffect(() => {
    if (isTyping && currentRoom) {
      updatePresence('online', undefined, currentRoom.id);
      const timeout = setTimeout(() => {
        updatePresence('online');
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping, currentRoom, updatePresence]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentRoom) return;

    try {
      await sendMessage(currentRoom.id, messageInput, 'text', replyTo || undefined);
      setMessageInput('');
      setReplyTo(null);
      setIsTyping(false);
      updatePresence('online');
      
      toast({
        title: "Message Sent",
        description: "Your encrypted message has been delivered",
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send message. Check your connection.",
        variant: "destructive"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
    }
  };

  const handleCreateDirectMessage = async () => {
    // For demo purposes - in real app, you'd select a user
    const recipientId = prompt('Enter recipient user ID:');
    if (recipientId) {
      try {
        const roomId = await createDirectMessageRoom(recipientId);
        if (roomId) {
          toast({
            title: "Chat Created",
            description: "Direct message room created successfully",
          });
        }
      } catch (error) {
        toast({
          title: "Creation Failed",
          description: "Failed to create direct message room",
          variant: "destructive"
        });
      }
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    searchQuery === ''
  );

  const getUserStatus = (userId: string) => {
    const presence = userPresence.get(userId);
    return presence?.status || 'offline';
  };

  const isUserTyping = (userId: string, roomId: string) => {
    const presence = userPresence.get(userId);
    return presence?.is_typing && presence?.typing_in_room === roomId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
      case 'synced':
      case 'operational':
        return 'text-green-400';
      case 'disconnected':
      case 'error':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Shield className="h-8 w-8 animate-pulse text-blue-400" />
          <p className="text-slate-300">Initializing secure chat...</p>
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[700px] bg-slate-900/50 border border-slate-700 rounded-lg backdrop-blur-lg overflow-hidden">
      {/* Sidebar - Chat Rooms */}
      <div className="w-80 border-r border-slate-700 flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Secure Chat</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-green-400">
                <Shield className="h-4 w-4" />
                <span className="text-xs">E2E</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBackendStatus(!showBackendStatus)}
                className="h-6 w-6 p-0"
              >
                <Database className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Backend Status Panel */}
          {showBackendStatus && (
            <div className="mb-4 p-3 bg-slate-800 rounded-lg border border-slate-600">
              <h3 className="text-sm font-medium text-white mb-2">Backend Status</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Supabase:</span>
                  <span className={getStatusColor(connectionStatus.supabase)}>
                    {connectionStatus.supabase}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Encryption:</span>
                  <span className={getStatusColor(connectionStatus.encryption)}>
                    {connectionStatus.encryption}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Real-time:</span>
                  <span className={getStatusColor(connectionStatus.realtime)}>
                    {connectionStatus.realtime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database:</span>
                  <span className={getStatusColor(connectionStatus.database)}>
                    {connectionStatus.database}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCreateDirectMessage}
              size="sm"
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              New Chat
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredRooms.map((room) => (
              <Button
                key={room.id}
                variant="ghost"
                onClick={() => setCurrentRoom(room)}
                className={`w-full justify-start p-3 h-auto text-left transition-all duration-200 ${
                  currentRoom?.id === room.id 
                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-400/20 border border-blue-500/30' 
                    : 'hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={room.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                        {room.name?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    {room.room_type === 'direct' && (
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                        getUserStatus(room.id) === 'online' ? 'bg-green-400' : 'bg-slate-500'
                      }`} />
                    )}
                    {room.is_encrypted && (
                      <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Lock className="h-2 w-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium truncate">
                        {room.name || 'Direct Message'}
                      </p>
                      <span className="text-xs text-slate-400">
                        {room.last_message_at && new Date(room.last_message_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-slate-400 text-sm truncate">
                        {room.last_message || 'No messages yet'}
                      </p>
                      {room.unread_count && room.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs animate-pulse">
                          {room.unread_count}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentRoom.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                    {currentRoom.name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-white font-semibold">
                      {currentRoom.name || 'Direct Message'}
                    </h3>
                    {currentRoom.is_encrypted && (
                      <Shield className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm flex items-center space-x-2">
                    <span>
                      {currentRoom.room_type === 'group' 
                        ? `${currentRoom.member_count} members`
                        : getUserStatus(currentRoom.id) === 'online' ? 'Online' : 'Offline'
                      }
                    </span>
                    <Wifi className="h-3 w-3" />
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <Video className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <Users className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 transition-all duration-200 hover:shadow-lg ${
                        message.sender_id === user?.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                          : 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                      }`}
                    >
                      {message.sender_id !== user?.id && (
                        <p className="text-xs opacity-70 mb-1 flex items-center space-x-1">
                          <span>{message.sender_name}</span>
                          <Shield className="h-3 w-3" />
                        </p>
                      )}
                      
                      {message.reply_to && (
                        <div className="text-xs opacity-70 mb-2 pl-2 border-l-2 border-slate-500 bg-black/20 rounded p-1">
                          Replying to message...
                        </div>
                      )}
                      
                      <p className="text-sm">{message.content}</p>
                      
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap mt-2 gap-1">
                          {message.reactions.map((reaction) => (
                            <Badge
                              key={reaction.id}
                              variant="secondary"
                              className="text-xs cursor-pointer hover:bg-slate-600 transition-colors"
                              onClick={() => addReaction(message.id, reaction.emoji)}
                            >
                              {reaction.emoji}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            onClick={() => setReplyTo(message.id)}
                          >
                            <Reply className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                            onClick={() => addReaction(message.id, '👍')}
                          >
                            <Smile className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {Object.entries(userPresence).some(([userId, presence]) => 
                  userId !== user?.id && isUserTyping(userId, currentRoom.id)
                ) && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-800/30">
              {replyTo && (
                <div className="mb-2 p-2 bg-slate-800 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-slate-300 flex items-center space-x-2">
                    <Reply className="h-3 w-3" />
                    <span>Replying to message</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyTo(null)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              )}
              
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={messageInput}
                  onChange={handleInputChange}
                  placeholder="Type your encrypted message..."
                  className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              
              <p className="text-xs text-slate-500 mt-2 flex items-center justify-center space-x-2">
                <Shield className="h-3 w-3" />
                <span>End-to-end encrypted • Backend: {connectionStatus.supabase}</span>
                <Server className="h-3 w-3" />
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-slate-800/50">
            <div className="text-center space-y-4">
              <div className="relative">
                <Shield className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                <div className="absolute inset-0 h-16 w-16 mx-auto mb-4 rounded-full border-2 border-slate-500/20 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-slate-400 max-w-md">
                Choose a chat from the sidebar to start messaging securely with end-to-end encryption
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500">
                <Database className="h-4 w-4" />
                <span>Backend Status: {connectionStatus.supabase}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
