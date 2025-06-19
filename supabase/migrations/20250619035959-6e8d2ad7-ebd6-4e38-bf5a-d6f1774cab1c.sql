
-- Create table for storing user key pairs for E2EE
CREATE TABLE public.user_key_pairs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  public_key INTEGER[] NOT NULL,
  private_key INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing encrypted messages
CREATE TABLE public.encrypted_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  encrypted_content INTEGER[] NOT NULL,
  iv INTEGER[] NOT NULL,
  mac INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for user_key_pairs
ALTER TABLE public.user_key_pairs ENABLE ROW LEVEL SECURITY;

-- Create policies for user_key_pairs (users can only access their own keys)
CREATE POLICY "Users can view their own key pairs" 
  ON public.user_key_pairs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own key pairs" 
  ON public.user_key_pairs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own key pairs" 
  ON public.user_key_pairs 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own key pairs" 
  ON public.user_key_pairs 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable Row Level Security for encrypted_messages
ALTER TABLE public.encrypted_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for encrypted_messages (users can access messages they sent or received)
CREATE POLICY "Users can view their own messages" 
  ON public.encrypted_messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages" 
  ON public.encrypted_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Enable realtime for encrypted_messages
ALTER TABLE public.encrypted_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.encrypted_messages;

-- Create indexes for better performance
CREATE INDEX idx_user_key_pairs_user_id ON public.user_key_pairs(user_id);
CREATE INDEX idx_encrypted_messages_sender_recipient ON public.encrypted_messages(sender_id, recipient_id);
CREATE INDEX idx_encrypted_messages_created_at ON public.encrypted_messages(created_at);
