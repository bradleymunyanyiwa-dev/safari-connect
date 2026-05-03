-- Hunting packages (admin-managed presets)
CREATE TABLE public.hunting_packages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'usd',
  duration_days integer NOT NULL DEFAULT 1,
  animal_ids integer[] NOT NULL DEFAULT '{}',
  inclusions text[] NOT NULL DEFAULT '{}',
  exclusions text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.hunting_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active packages public"
  ON public.hunting_packages FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins view all packages"
  ON public.hunting_packages FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins insert packages"
  ON public.hunting_packages FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update packages"
  ON public.hunting_packages FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete packages"
  ON public.hunting_packages FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_hunting_packages_updated_at
  BEFORE UPDATE ON public.hunting_packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Link trip requests to a chosen package (optional)
ALTER TABLE public.trip_requests
  ADD COLUMN package_id uuid REFERENCES public.hunting_packages(id) ON DELETE SET NULL;

-- Seed a few starter packages
INSERT INTO public.hunting_packages (name, description, price_cents, duration_days, inclusions, exclusions, sort_order) VALUES
  ('Plains Game Starter', '5-day plains game safari ideal for first-time hunters. Includes 2 trophy animals.', 350000, 5,
   ARRAY['Lodging','3 meals/day','Professional guide','Field prep','Transport from camp'],
   ARRAY['International flights','Trophy fees beyond package','Taxidermy','Gratuities'], 1),
  ('Big Game Classic', '10-day mid-tier safari covering plains and select dangerous game. Up to 4 trophies.', 950000, 10,
   ARRAY['Lodging','3 meals/day','PH + tracker','Daily 4x4 transport','Trophy field prep'],
   ARRAY['Flights','Additional trophy fees','Taxidermy & shipping','Gratuities','Alcohol'], 2),
  ('Big 5 Premium', '14-day premium expedition for experienced hunters pursuing dangerous game.', 2800000, 14,
   ARRAY['Premium lodging','All meals','Senior PH + full team','4x4 + charter transfers','Field prep & permits'],
   ARRAY['International flights','CITES export fees','Taxidermy & shipping','Gratuities'], 3);