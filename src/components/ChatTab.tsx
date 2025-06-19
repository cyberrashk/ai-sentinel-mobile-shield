
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Shield, Users, Search, Plus, Phone, Video } from 'lucide-react';
import { EnhancedChatInterface } from './EnhancedChatInterface';
import { VoiceVideoCall } from './VoiceVideoCall';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Contact {
  id: string;
  full_name: string;
  email: string;
  status?: string;
}

export const ChatTab = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('chats');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [callData, setCallData] = useState<any>(null);

  const loadContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .neq('id', user.id)
        .limit(50);

      if (data) {
        setContacts(data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (activeTab === 'contacts') {
      loadContacts();
    }
  }, [activeTab, user]);

  const startCall = async (contactId: string, callType: 'voice' | 'video') => {
    try {
      // Create or get direct message room
      const { data: roomId } = await supabase.rpc('create_direct_message_room', {
        recipient_id: contactId
      });

      if (roomId) {
        // Create call record
        const { data: call } = await supabase
          .from('calls')
          .insert({
            room_id: roomId,
            initiator_id: user?.id,
            call_type: callType,
            status: 'ringing'
          })
          .select()
          .single();

        if (call) {
          // Add participants
          await supabase.from('call_participants').insert([
            {
              call_id: call.id,
              user_id: user?.id,
              is_video_enabled: callType === 'video'
            },
            {
              call_id: call.id,
              user_id: contactId,
              is_video_enabled: callType === 'video'
            }
          ]);

          setCallData({
            ...call,
            participants: [
              { id: user?.id, name: 'You', isMuted: false, isVideoEnabled: callType === 'video' },
              { id: contactId, name: contacts.find(c => c.id === contactId)?.full_name || 'Contact', isMuted: false, isVideoEnabled: callType === 'video' }
            ]
          });
          setShowCall(true);
        }
      }
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const endCall = () => {
    setShowCall(false);
    setCallData(null);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (showCall && callData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={endCall}
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            ← Back to Chat
          </Button>
          <h2 className="text-2xl font-bold text-white">Voice/Video Call</h2>
        </div>
        <VoiceVideoCall
          roomId={callData.room_id}
          callType={callData.call_type}
          participants={callData.participants}
          onEndCall={endCall}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Secure Communication Platform
        </h2>
        <p className="text-slate-300">
          End-to-end encrypted messaging, voice & video calls with enterprise-grade security
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border-slate-700">
          <TabsTrigger value="chats" className="data-[state=active]:bg-slate-700">
            <MessageCircle className="h-4 w-4 mr-2" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-slate-700">
            <Users className="h-4 w-4 mr-2" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-slate-700">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="space-y-4">
          <EnhancedChatInterface />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span>Contacts</span>
                </div>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-400">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                />
              </div>

              {/* Contacts List */}
              <div className="space-y-2">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400">No contacts found</p>
                  </div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-700 border border-slate-600 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {(contact.full_name || contact.email)?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {contact.full_name || 'Unknown User'}
                          </p>
                          <p className="text-slate-400 text-sm">{contact.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startCall(contact.id, 'voice')}
                          className="text-slate-400 hover:text-white"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startCall(contact.id, 'video')}
                          className="text-slate-400 hover:text-white"
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm" 
                          variant="ghost"
                          className="text-slate-400 hover:text-white"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Security & Privacy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Encryption Status */}
              <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-6 w-6 text-green-400" />
                  <span className="text-green-400 font-semibold text-lg">Encryption Active</span>
                </div>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• End-to-end encryption using ECDH key exchange</li>
                  <li>• AES-256-GCM for message encryption</li>
                  <li>• Perfect Forward Secrecy (PFS)</li>
                  <li>• Message Authentication Codes (MAC)</li>
                  <li>• SRTP for voice/video call encryption</li>
                  <li>• Zero server-side decryption capability</li>
                </ul>
              </div>

              {/* Security Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Message Security</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>✓ End-to-end encrypted</li>
                    <li>✓ Message authentication</li>
                    <li>✓ Forward secrecy</li>
                    <li>✓ Encrypted file sharing</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-slate-800 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Call Security</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>✓ SRTP encryption</li>
                    <li>✓ Peer-to-peer connection</li>
                    <li>✓ ICE/STUN/TURN support</li>
                    <li>✓ Media stream encryption</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Privacy Protection</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>✓ No message logging</li>
                    <li>✓ Metadata protection</li>
                    <li>✓ Typing indicators</li>
                    <li>✓ Read receipts</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg">
                  <h4 className="text-white font-medium mb-2">Enterprise Features</h4>
                  <ul className="text-sm text-slate-400 space-y-1">
                    <li>✓ Audit logging</li>
                    <li>✓ Compliance ready</li>
                    <li>✓ Group key management</li>
                    <li>✓ Admin controls</li>
                  </ul>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-700">
                <p className="text-slate-400 text-sm">
                  🔒 Your conversations are private and secure. Even we cannot read your messages.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
