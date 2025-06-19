
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, Shield, Users, Search } from 'lucide-react';
import { E2EEChat } from './E2EEChat';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Contact {
  id: string;
  full_name: string;
  email: string;
}

export const ChatTab = () => {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .neq('id', user?.id)
        .limit(20);

      if (data) {
        setContacts(data);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
    setLoading(false);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedContact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setSelectedContact(null)}
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            ← Back to Contacts
          </Button>
          <h2 className="text-2xl font-bold text-white">Secure Chat</h2>
        </div>
        <E2EEChat
          recipientId={selectedContact.id}
          recipientName={selectedContact.full_name || selectedContact.email}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          End-to-End Encrypted Chat
        </h2>
        <p className="text-slate-300">
          Secure messaging with military-grade encryption and perfect forward secrecy
        </p>
      </div>

      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <MessageCircle className="h-5 w-5 text-blue-400" />
            <span>Select Contact to Chat</span>
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

          {/* Security Notice */}
          <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-green-400 font-semibold">Security Features</span>
            </div>
            <ul className="text-sm text-slate-300 mt-2 space-y-1">
              <li>• AES-256-GCM encryption with ECDH key exchange</li>
              <li>• Perfect forward secrecy (PFS)</li>
              <li>• Message authentication codes (MAC)</li>
              <li>• Zero server-side decryption capability</li>
            </ul>
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
                <Button
                  key={contact.id}
                  variant="ghost"
                  onClick={() => setSelectedContact(contact)}
                  className="w-full justify-start p-4 h-auto bg-slate-800/50 hover:bg-slate-700 border border-slate-600 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {(contact.full_name || contact.email)?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        {contact.full_name || 'Unknown User'}
                      </p>
                      <p className="text-slate-400 text-sm">{contact.email}</p>
                    </div>
                    <MessageCircle className="h-4 w-4 text-slate-500" />
                  </div>
                </Button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
