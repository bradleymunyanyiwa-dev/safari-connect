import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MapPin, Award, Mail, Phone, BadgeCheck, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTripList } from "@/store/tripList";

type Guide = {
  id: string;
  full_name: string;
  bio: string | null;
  years_experience: number | null;
  hunting_areas: string[] | null;
  specialties: string[] | null;
  license_number: string | null;
  contact_email: string | null;
  contact_phone: string | null;
};

const GuideDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const tripCount = useTripList((s) => s.list.length);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("id, full_name, bio, years_experience, hunting_areas, specialties, license_number, contact_email, contact_phone")
        .eq("id", id)
        .eq("approval_status", "approved")
        .maybeSingle();
      if (error) toast.error(error.message);
      setGuide(data);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-foreground-dim" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen grid place-items-center text-foreground-dim">
        Guide not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-3xl">
        <Link to="/guides" className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> All guides
        </Link>

        <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-deep">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-black">{guide.full_name}</h1>
              {guide.years_experience != null && (
                <p className="inline-flex items-center gap-1.5 text-sm text-accent mt-2">
                  <Award className="w-4 h-4" />
                  {guide.years_experience} years experience
                </p>
              )}
            </div>
            {guide.license_number && (
              <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider bg-muted text-foreground px-3 py-1.5 rounded">
                <BadgeCheck className="w-3.5 h-3.5 text-accent" />
                Lic. {guide.license_number}
              </span>
            )}
          </div>

          {guide.bio && (
            <p className="text-foreground-dim leading-relaxed whitespace-pre-line mt-6">
              {guide.bio}
            </p>
          )}

          {(guide.hunting_areas?.length ?? 0) > 0 && (
            <Section label="Hunting areas">
              <div className="flex flex-wrap gap-2">
                {guide.hunting_areas!.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 text-sm bg-muted text-foreground px-2.5 py-1 rounded">
                    <MapPin className="w-3.5 h-3.5 text-accent" /> {a}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {(guide.specialties?.length ?? 0) > 0 && (
            <Section label="Specialties">
              <div className="flex flex-wrap gap-2">
                {guide.specialties!.map((s) => (
                  <span key={s} className="text-sm bg-muted text-foreground px-2.5 py-1 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {(guide.contact_email || guide.contact_phone) && (
            <Section label="Contact">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                {guide.contact_email && (
                  <a href={`mailto:${guide.contact_email}`} className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent">
                    <Mail className="w-4 h-4" /> {guide.contact_email}
                  </a>
                )}
                {guide.contact_phone && (
                  <a href={`tel:${guide.contact_phone}`} className="inline-flex items-center gap-2 text-sm text-foreground hover:text-accent">
                    <Phone className="w-4 h-4" /> {guide.contact_phone}
                  </a>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="mt-6 pt-6 border-t border-border">
    <p className="text-xs uppercase tracking-[0.2em] text-foreground-dim mb-3">{label}</p>
    {children}
  </div>
);

export default GuideDetail;
