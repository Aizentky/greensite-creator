CREATE TABLE public.login_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL,
  ip text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.login_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read login events"
ON public.login_events FOR SELECT TO public USING (true);

CREATE POLICY "Anyone can insert login events"
ON public.login_events FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Anyone can delete login events"
ON public.login_events FOR DELETE TO public USING (true);

CREATE INDEX login_events_created_at_idx ON public.login_events (created_at DESC);