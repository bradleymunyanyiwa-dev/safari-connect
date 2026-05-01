-- Messages tied to a trip request for context
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_request_id UUID NOT NULL REFERENCES public.trip_requests(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_trip ON public.messages(trip_request_id, created_at);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper: is current user a participant in the trip request?
CREATE OR REPLACE FUNCTION public.is_trip_participant(_trip_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.trip_requests tr
    LEFT JOIN public.guides g ON g.id = tr.guide_id
    WHERE tr.id = _trip_id
      AND (tr.client_id = _user_id OR g.user_id = _user_id)
  )
$$;

-- View messages: participants + admins
CREATE POLICY "Participants view messages"
  ON public.messages FOR SELECT
  USING (public.is_trip_participant(trip_request_id, auth.uid()));

CREATE POLICY "Admins view all messages"
  ON public.messages FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Send messages: must be sender AND a participant
CREATE POLICY "Participants send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND public.is_trip_participant(trip_request_id, auth.uid())
  );

-- Mark read: participants can update read_at on messages they received
CREATE POLICY "Participants mark messages read"
  ON public.messages FOR UPDATE
  USING (
    public.is_trip_participant(trip_request_id, auth.uid())
    AND sender_id <> auth.uid()
  );

-- Realtime
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;