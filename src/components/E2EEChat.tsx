
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Send, Lock, Users } from 'lucide-react';
import { useE2EEChat } from '@/hooks/useE2EEChat';
import { useAuth } from '@/hooks/useAuth';

interface E2EEChatProps {
  recipientId: string;
  recipientName: string;
}

export const E2EEChat = ({ recipientId, recipientName }: E2EEChatProps) => {
  const { user } = useAuth();
  const { messages, sendMessage, loading, sending, keyPair } = useE2EEChat(recipientId);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    await sendMessage(messageInput);
    setMessageInput('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Shield className="h-8 w-8 animate-pulse text-blue-400" />
          <p className="text-slate-300">Initializing encryption...</p>
        </div>
      </div>
    );
  }

  if (!keyPair) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Lock className="h-8 w-8 text-red-400" />
          <p className="text-slate-300">Encryption keys not available</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-[600px] bg-slate-900/50 border-slate-700 backdrop-blur-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span>Chat with {recipientName}</span>
          </div>
          <div className="flex items-center space-x-1 text-green-400">
            <Shield className="h-4 w-4" />
            <span className="text-xs">E2E Encrypted</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col h-[500px] p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-slate-400 text-center">
                  Start a secure conversation<br />
                  <span className="text-xs">All messages are end-to-end encrypted</span>
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender_id === user?.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-slate-700">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type your encrypted message..."
              className="flex-1 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              disabled={sending}
            />
            <Button
              type="submit"
              disabled={sending || !messageInput.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-slate-500 mt-2 flex items-center">
            <Lock className="h-3 w-3 mr-1" />
            Messages are encrypted end-to-end using AES-256-GCM
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
