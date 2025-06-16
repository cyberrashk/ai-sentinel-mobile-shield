
-- Create users profile table for additional user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for behavioral biometrics data
CREATE TABLE public.behavioral_patterns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  keystroke_dynamics JSONB,
  interaction_patterns JSONB,
  risk_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for threat visualizations and reports
CREATE TABLE public.threat_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  threat_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  location_data JSONB,
  remediation_status TEXT DEFAULT 'pending',
  compliance_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create table for VPN quantum-resistant sessions
CREATE TABLE public.vpn_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  server_location TEXT NOT NULL,
  encryption_protocol TEXT DEFAULT 'quantum-resistant',
  session_data JSONB,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavioral_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vpn_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for behavioral patterns
CREATE POLICY "Users can view own behavioral patterns" ON public.behavioral_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own behavioral patterns" ON public.behavioral_patterns FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for threat reports
CREATE POLICY "Users can view own threat reports" ON public.threat_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own threat reports" ON public.threat_reports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own threat reports" ON public.threat_reports FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for VPN sessions
CREATE POLICY "Users can view own VPN sessions" ON public.vpn_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own VPN sessions" ON public.vpn_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own VPN sessions" ON public.vpn_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
