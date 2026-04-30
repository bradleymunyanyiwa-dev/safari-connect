import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MapPin, Award, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Guide = {
  id: string;
  full_name: string;
  bio: string | null;
  years_experience: number | null;
  hunting_areas: string[] | null;
  specialties: string[] | null;
};

const Guides = () => {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [area, setArea] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("guides")
        .select("id, full_name, bio, years_experience, hunting_areas, specialties")
        .eq("approval_status", "approved")
        .order("full_name");
      if (error) toast.error(error.message);
      setGuides(data ?? []);
      setLoading(false);
    })();
  }, []);

  const allAreas = useMemo(
    () => Array.from(new Set(guides.flatMap((g) => g.hunting_areas ?? []))).sort(),
    [guides]
  );
  const allSpecialties = useMemo(
    () => Array.from(new Set(guides.flatMap((g) => g.specialties ?? []))).sort(),
    [guides]
  );

  const filtered = guides.filter((g) => {
    if (q && !g.full_name.toLowerCase().includes(q.toLowerCase())) return false;
    if (area && !(g.hunting_areas ?? []).includes(area)) return false;
    if (specialty && !(g.specialties ?? []).includes(specialty)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <header className="mb-8">
          <p className="text-accent font-bold tracking-[0.25em] text-xs uppercase mb-2">Vetted Professionals</p>
          <h1 className="font-display text-4xl sm:text-5xl font-black">Find your guide</h1>
          <p className="text-foreground-dim mt-2 max-w-xl">
            Licensed professional hunters across Zimbabwe and Southern Africa.
          </p>
        </header>

        <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-dim" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name…"
              className="pl-9"
            />
          </div>

          {allAreas.length > 0 && (
            <FilterRow
              label="Area"
              options={allAreas}
              value={area}
              onChange={setArea}
            />
          )}
          {allSpecialties.length > 0 && (
            <FilterRow
              label="Specialty"
              options={allSpecialties}
              value={specialty}
              onChange={setSpecialty}
            />
          )}
        </div>

        {loading ? (
          <div className="grid place-items-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-foreground-dim" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-foreground-dim">
            {guides.length === 0 ? "No approved guides yet." : "No guides match your filters."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((g) => (
              <Link
                key={g.id}
                to={`/guides/${g.id}`}
                className="bg-card border border-border rounded-lg p-5 hover:border-accent/60 hover:-translate-y-0.5 transition-all"
              >
                <h2 className="font-display text-xl font-bold text-foreground">{g.full_name}</h2>
                {g.years_experience != null && (
                  <p className="inline-flex items-center gap-1.5 text-xs text-accent mt-1">
                    <Award className="w-3.5 h-3.5" />
                    {g.years_experience} yrs experience
                  </p>
                )}
                {g.bio && (
                  <p className="text-sm text-foreground-dim mt-3 line-clamp-3">{g.bio}</p>
                )}
                {(g.hunting_areas?.length ?? 0) > 0 && (
                  <p className="inline-flex items-center gap-1.5 text-xs text-foreground-dim mt-3">
                    <MapPin className="w-3.5 h-3.5" />
                    {g.hunting_areas!.slice(0, 3).join(" · ")}
                  </p>
                )}
                {(g.specialties?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {g.specialties!.slice(0, 4).map((s) => (
                      <span key={s} className="text-[10px] uppercase tracking-wider bg-muted text-foreground px-2 py-0.5 rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterRow = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) => (
  <div>
    <p className="text-xs uppercase tracking-wider text-foreground-dim mb-2">{label}</p>
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant={value === null ? "default" : "outline"}
        onClick={() => onChange(null)}
      >
        All
      </Button>
      {options.map((o) => (
        <Button
          key={o}
          type="button"
          size="sm"
          variant={value === o ? "default" : "outline"}
          onClick={() => onChange(o)}
        >
          {o}
        </Button>
      ))}
    </div>
  </div>
);

export default Guides;
