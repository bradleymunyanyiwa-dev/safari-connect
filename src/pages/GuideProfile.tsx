import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Loader2, X } from "lucide-react";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(100),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
  years_experience: z.number().int().min(0).max(80).nullable(),
  license_number: z.string().trim().max(100).optional().or(z.literal("")),
  contact_email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  contact_phone: z.string().trim().max(40).optional().or(z.literal("")),
  hunting_areas: z.array(z.string().trim().min(1).max(60)).max(20),
  specialties: z.array(z.string().trim().min(1).max(60)).max(20),
});

const TagInput = ({
  label,
  values,
  setValues,
  placeholder,
}: {
  label: string;
  values: string[];
  setValues: (v: string[]) => void;
  placeholder: string;
}) => {
  const [draft, setDraft] = useState("");
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    if (values.includes(v)) { setDraft(""); return; }
    if (values.length >= 20) { toast.error("Max 20 items"); return; }
    if (v.length > 60) { toast.error("Max 60 chars per tag"); return; }
    setValues([...values, v]);
    setDraft("");
  };
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2 mt-1.5">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={add}>Add</Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((v) => (
            <span key={v} className="inline-flex items-center gap-1 text-xs bg-muted text-foreground px-2 py-1 rounded">
              {v}
              <button
                type="button"
                onClick={() => setValues(values.filter((x) => x !== v))}
                className="hover:text-destructive"
                aria-label={`Remove ${v}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const GuideProfile = () => {
  const { user, guideStatus, refresh } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [years, setYears] = useState<string>("");
  const [license, setLicense] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [areas, setAreas] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [exists, setExists] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      if (data) {
        setExists(true);
        setFullName(data.full_name ?? "");
        setBio(data.bio ?? "");
        setYears(data.years_experience?.toString() ?? "");
        setLicense(data.license_number ?? "");
        setContactEmail(data.contact_email ?? user.email ?? "");
        setContactPhone(data.contact_phone ?? "");
        setAreas(data.hunting_areas ?? []);
        setSpecialties(data.specialties ?? []);
      } else {
        setContactEmail(user.email ?? "");
      }
      setLoading(false);
    })();
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const yearsNum = years.trim() === "" ? null : Number(years);
    const parsed = profileSchema.safeParse({
      full_name: fullName,
      bio,
      years_experience: yearsNum,
      license_number: license,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      hunting_areas: areas,
      specialties,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSaving(true);
    const payload = {
      user_id: user.id,
      full_name: parsed.data.full_name,
      bio: parsed.data.bio || null,
      years_experience: parsed.data.years_experience,
      license_number: parsed.data.license_number || null,
      contact_email: parsed.data.contact_email || null,
      contact_phone: parsed.data.contact_phone || null,
      hunting_areas: parsed.data.hunting_areas,
      specialties: parsed.data.specialties,
    };

    const { error } = exists
      ? await supabase.from("guides").update(payload).eq("user_id", user.id)
      : await supabase.from("guides").insert(payload);

    setSaving(false);
    if (error) return toast.error(error.message);

    toast.success("Profile saved");
    setExists(true);
    await refresh();
    if (guideStatus !== "approved") navigate("/guide-pending");
  };

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-foreground-dim">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">Guide profile</h1>
        <p className="text-sm text-foreground-dim mb-8">
          Complete your profile so hunters can find you. Changes go live once approved by an admin.
        </p>

        <form onSubmit={onSubmit} className="space-y-5 bg-card border border-border rounded-lg p-6 shadow-deep">
          <div>
            <Label htmlFor="full_name">Full name *</Label>
            <Input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={100} required />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="Tell clients about your experience, philosophy, and what makes your operation unique."
            />
            <p className="text-xs text-foreground-dim mt-1">{bio.length}/2000</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="years">Years experience</Label>
              <Input
                id="years"
                type="number"
                min={0}
                max={80}
                value={years}
                onChange={(e) => setYears(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="license">License number</Label>
              <Input id="license" value={license} onChange={(e) => setLicense(e.target.value)} maxLength={100} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cemail">Contact email</Label>
              <Input id="cemail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} maxLength={255} />
            </div>
            <div>
              <Label htmlFor="cphone">Contact phone</Label>
              <Input id="cphone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} maxLength={40} />
            </div>
          </div>

          <TagInput
            label="Hunting areas"
            values={areas}
            setValues={setAreas}
            placeholder="e.g. Matetsi — press Enter"
          />
          <TagInput
            label="Specialties"
            values={specialties}
            setValues={setSpecialties}
            placeholder="e.g. Cape Buffalo — press Enter"
          />

          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="hunt" disabled={saving} className="flex-1">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : exists ? "Save changes" : "Submit for review"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuideProfile;
