ALTER TABLE public.login_events 
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS region text;