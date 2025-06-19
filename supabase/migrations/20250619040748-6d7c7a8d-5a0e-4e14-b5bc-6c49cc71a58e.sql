
-- Create enum for message types
CREATE TYPE public.message_type AS ENUM ('text', 'image', 'file', 'voice', 'video', 'reaction', 'reply', 'system');

-- Create enum for chat room types
CREATE TYPE public.room_type AS ENUM ('direct', 'group', 'channel');

-- Create enum for user roles in rooms
CREATE TYPE public.room_role AS ENUM ('owner', 'admin', 'moderator', 'member');

-- Create enum for call types
CREATE TYPE public.call_type AS ENUM ('voice', 'video', 'screen_share');

-- Create enum for call status
CREATE TYPE public.call_status AS ENUM ('ringing', 'ongoing', 'ended', 'missed', 'declined');

-- Create chat rooms table
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  description TEXT,
  room_type room_type NOT NULL DEFAULT 'direct',
  avatar_url TEXT,
  is_encrypted BOOLEAN NOT NULL DEFAULT true,
  group_key_version INTEGER DEFAULT 1,
  max_members INTEGER DEFAULT 1000,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room members table
CREATE TABLE public.room_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role room_role NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_muted BOOLEAN DEFAULT false,
  UNIQUE(room_id, user_id)
);

-- Enhanced messages table (replacing the simple encrypted_messages)
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type message_type NOT NULL DEFAULT 'text',
  encrypted_content INTEGER[] NOT NULL,
  iv INTEGER[] NOT NULL,
  mac INTEGER[] NOT NULL,
  reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT,
  file_type TEXT,
  metadata JSONB DEFAULT '{}',
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Message reactions table
CREATE TABLE public.message_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);

-- Voice/Video calls table
CREATE TABLE public.calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  initiator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  call_type call_type NOT NULL,
  status call_status NOT NULL DEFAULT 'ringing',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER DEFAULT 0,
  recording_url TEXT,
  is_recorded BOOLEAN DEFAULT false,
  webrtc_session_data JSONB DEFAULT '{}'
);

-- Call participants table
CREATE TABLE public.call_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id UUID NOT NULL REFERENCES public.calls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_muted BOOLEAN DEFAULT false,
  is_video_enabled BOOLEAN DEFAULT true,
  peer_connection_data JSONB DEFAULT '{}',
  UNIQUE(call_id, user_id)
);

-- User presence/status table
CREATE TABLE public.user_presence (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'offline', -- online, offline, away, busy
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  typing_in_room UUID REFERENCES public.chat_rooms(id) ON DELETE SET NULL,
  is_typing BOOLEAN DEFAULT false,
  custom_status TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Group encryption keys table (for group chats)
CREATE TABLE public.group_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  key_version INTEGER NOT NULL DEFAULT 1,
  encrypted_key INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, key_version)
);

-- Member-specific group key shares
CREATE TABLE public.member_key_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_key_id UUID NOT NULL REFERENCES public.group_keys(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  encrypted_key_share INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_key_id, member_id)
);

-- Enable RLS on all tables
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_key_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_rooms
CREATE POLICY "Users can view rooms they are members of"
  ON public.chat_rooms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.room_members 
      WHERE room_id = chat_rooms.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create rooms"
  ON public.chat_rooms FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room admins can update rooms"
  ON public.chat_rooms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.room_members 
      WHERE room_id = chat_rooms.id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for room_members
CREATE POLICY "Users can view room members for their rooms"
  ON public.room_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.room_members rm 
      WHERE rm.room_id = room_members.room_id AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "Room admins can manage members"
  ON public.room_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.room_members rm 
      WHERE rm.room_id = room_members.room_id 
      AND rm.user_id = auth.uid() 
      AND rm.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their rooms"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.room_members 
      WHERE room_id = messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their rooms"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.room_members 
      WHERE room_id = messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own messages"
  ON public.messages FOR UPDATE
  USING (auth.uid() = sender_id);

-- RLS Policies for message_reactions
CREATE POLICY "Users can view reactions in their rooms"
  ON public.message_reactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.messages m
      JOIN public.room_members rm ON m.room_id = rm.room_id
      WHERE m.id = message_reactions.message_id AND rm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own reactions"
  ON public.message_reactions FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for calls
CREATE POLICY "Users can view calls in their rooms"
  ON public.calls FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.room_members 
      WHERE room_id = calls.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can initiate calls in their rooms"
  ON public.calls FOR INSERT
  WITH CHECK (
    auth.uid() = initiator_id AND
    EXISTS (
      SELECT 1 FROM public.room_members 
      WHERE room_id = calls.room_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for user_presence
CREATE POLICY "Users can view presence of users in shared rooms"
  ON public.user_presence FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.room_members rm1
      JOIN public.room_members rm2 ON rm1.room_id = rm2.room_id
      WHERE rm1.user_id = auth.uid() AND rm2.user_id = user_presence.user_id
    )
  );

CREATE POLICY "Users can update their own presence"
  ON public.user_presence FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for group_keys and member_key_shares
CREATE POLICY "Users can view group keys for their rooms"
  ON public.group_keys FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.room_members 
      WHERE room_id = group_keys.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own key shares"
  ON public.member_key_shares FOR SELECT
  USING (auth.uid() = member_id);

-- Enable realtime for all tables
ALTER TABLE public.chat_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_members REPLICA IDENTITY FULL;
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER TABLE public.message_reactions REPLICA IDENTITY FULL;
ALTER TABLE public.calls REPLICA IDENTITY FULL;
ALTER TABLE public.call_participants REPLICA IDENTITY FULL;
ALTER TABLE public.user_presence REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;

-- Create indexes for performance
CREATE INDEX idx_room_members_room_user ON public.room_members(room_id, user_id);
CREATE INDEX idx_messages_room_created ON public.messages(room_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_message_reactions_message ON public.message_reactions(message_id);
CREATE INDEX idx_calls_room_status ON public.calls(room_id, status);
CREATE INDEX idx_user_presence_status ON public.user_presence(status, last_seen);

-- Create functions for automatic room creation in direct messages
CREATE OR REPLACE FUNCTION create_direct_message_room(recipient_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  room_id UUID;
  sender_id UUID := auth.uid();
BEGIN
  -- Check if direct message room already exists
  SELECT cr.id INTO room_id
  FROM chat_rooms cr
  JOIN room_members rm1 ON cr.id = rm1.room_id
  JOIN room_members rm2 ON cr.id = rm2.room_id
  WHERE cr.room_type = 'direct'
    AND rm1.user_id = sender_id
    AND rm2.user_id = recipient_id
    AND (SELECT COUNT(*) FROM room_members WHERE room_id = cr.id) = 2;

  -- If room doesn't exist, create it
  IF room_id IS NULL THEN
    INSERT INTO chat_rooms (room_type, created_by)
    VALUES ('direct', sender_id)
    RETURNING id INTO room_id;

    -- Add both users as members
    INSERT INTO room_members (room_id, user_id, role)
    VALUES 
      (room_id, sender_id, 'member'),
      (room_id, recipient_id, 'member');
  END IF;

  RETURN room_id;
END;
$$;
