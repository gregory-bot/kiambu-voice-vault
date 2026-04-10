
-- Create table for voice recordings
CREATE TABLE public.voice_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  description TEXT,
  facility TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.voice_recordings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (no auth required for simplicity)
CREATE POLICY "Anyone can insert recordings"
  ON public.voice_recordings FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view recordings
CREATE POLICY "Anyone can view recordings"
  ON public.voice_recordings FOR SELECT
  USING (true);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio', 'audio', true);

-- Allow anyone to upload audio
CREATE POLICY "Anyone can upload audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'audio');

-- Allow anyone to view audio
CREATE POLICY "Anyone can view audio"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'audio');
