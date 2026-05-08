CREATE TABLE public.buyer_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.buyer_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read buyer accounts"
ON public.buyer_accounts FOR SELECT
USING (true);

CREATE POLICY "Anyone can create buyer accounts"
ON public.buyer_accounts FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can delete buyer accounts"
ON public.buyer_accounts FOR DELETE
USING (true);