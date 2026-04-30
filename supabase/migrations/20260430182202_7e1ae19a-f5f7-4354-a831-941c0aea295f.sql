CREATE TYPE public.trip_status AS ENUM ('pending','accepted','declined','completed','cancelled');

CREATE TABLE public.trip_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  guide_id UUID NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  animal_ids INTEGER[] NOT NULL DEFAULT '{}',
  preferred_start DATE,
  preferred_end DATE,
  party_size INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  status public.trip_status NOT NULL DEFAULT 'pending',
  guide_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_trip_requests_client ON public.trip_requests(client_id);
CREATE INDEX idx_trip_requests_guide ON public.trip_requests(guide_id);
CREATE INDEX idx_trip_requests_status ON public.trip_requests(status);

ALTER TABLE public.trip_requests ENABLE ROW LEVEL SECURITY;

-- Clients
CREATE POLICY "Clients view own requests"
  ON public.trip_requests FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "Clients create own requests"
  ON public.trip_requests FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients cancel own pending requests"
  ON public.trip_requests FOR UPDATE
  USING (auth.uid() = client_id AND status = 'pending')
  WITH CHECK (auth.uid() = client_id);

-- Guides
CREATE POLICY "Guides view requests to them"
  ON public.trip_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.guides g WHERE g.id = trip_requests.guide_id AND g.user_id = auth.uid()));

CREATE POLICY "Guides update requests to them"
  ON public.trip_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.guides g WHERE g.id = trip_requests.guide_id AND g.user_id = auth.uid()));

-- Admins
CREATE POLICY "Admins view all requests"
  ON public.trip_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update all requests"
  ON public.trip_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trip_requests_updated_at
  BEFORE UPDATE ON public.trip_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();