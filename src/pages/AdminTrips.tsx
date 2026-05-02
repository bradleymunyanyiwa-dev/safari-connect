import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MessageSquare, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type TripRow = {
  id: string;
  client_id: string;
  guide_id: string;
  status: "pending" | "accepted" | "declined" | "completed" | "cancelled";
  party_size: number;
  preferred_start: string | null;
  preferred_end: string | null;
  message: string | null;
  guide_response: string | null;
  created_at: string;
};

type Lookup = Record<string, string>;
const STATUSES = ["all", "pending", "accepted", "completed", "declined", "cancelled"] as const;
type Filter = (typeof STATUSES)[number];

const statusTone = (s: TripRow["status"]) => {
  switch (s) {
    case "pending": return "bg-accent/20 text-accent";
    case "accepted": return "bg-success/20 text-success";
    case "completed": return "bg-success/30 text-success";
    case "declined":
    case "cancelled": return "bg-destructive/20 text-destructive";
    default: return "bg-muted text-foreground-dim";
  }
};

const AdminTrips = () => {
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [clients, setClients] = useState<Lookup>({});
  const [guides, setGuides] = useState<Lookup>({});
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("trip_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const rows = (data as TripRow[]) ?? [];
    setTrips(rows);

    const clientIds = Array.from(new Set(rows.map((r) => r.client_id)));
    const guideIds = Array.from(new Set(rows.map((r) => r.guide_id)));

    const [profRes, guideRes] = await Promise.all([
      clientIds.length
        ? supabase.from("profiles").select("user_id, display_name").in("user_id", clientIds)
        : Promise.resolve({ data: [] as { user_id: string; display_name: string | null }[] }),
      guideIds.length
        ? supabase.from("guides").select("id, full_name").in("id", guideIds)
        : Promise.resolve({ data: [] as { id: string; full_name: string }[] }),
    ]);

    const cMap: Lookup = {};
    (profRes.data ?? []).forEach((p) => { cMap[p.user_id] = p.display_name ?? "—"; });
    setClients(cMap);

    const gMap: Lookup = {};
    (guideRes.data ?? []).forEach((g) => { gMap[g.id] = g.full_name; });
    setGuides(gMap);

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const markCompleted = async (id: string) => {
    const { error } = await supabase
      .from("trip_requests")
      .update({ status: "completed" })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Trip marked complete");
    load();
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return trips.filter((t) => {
      if (filter !== "all" && t.status !== filter) return false;
      if (!q) return true;
      const c = (clients[t.client_id] ?? "").toLowerCase();
      const g = (guides[t.guide_id] ?? "").toLowerCase();
      return c.includes(q) || g.includes(q);
    });
  }, [trips, filter, query, clients, guides]);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="container max-w-5xl">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <header className="mb-6">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Admin</p>
          <h1 className="font-display text-3xl font-bold">Trip requests</h1>
        </header>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by client or guide name…"
              className="pl-10"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {STATUSES.map((s) => (
              <Button
                key={s}
                size="sm"
                variant={filter === s ? "hunt" : "outline"}
                onClick={() => setFilter(s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-foreground-dim">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-foreground-dim text-center py-12">No trip requests match.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <div key={t.id} className="bg-card border border-border/60 rounded-xl p-4 shadow-card">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">
                        {clients[t.client_id] ?? "Unknown client"}
                        <span className="text-foreground-dim font-normal"> → </span>
                        {guides[t.guide_id] ?? "Unknown guide"}
                      </h3>
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${statusTone(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-foreground-dim mt-1">
                      Party of {t.party_size}
                      {t.preferred_start && ` · ${t.preferred_start}`}
                      {t.preferred_end && ` → ${t.preferred_end}`}
                      {" · "}requested {new Date(t.created_at).toLocaleDateString()}
                    </p>
                    {t.message && <p className="text-sm text-foreground-dim mt-2 italic">"{t.message}"</p>}
                    {t.guide_response && (
                      <p className="text-sm text-foreground mt-2">
                        <span className="text-[10px] uppercase tracking-wider text-foreground-dim mr-2">Guide reply</span>
                        {t.guide_response}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <Link to={`/trips/${t.id}/messages`}>
                      <Button size="sm" variant="outline" className="w-full sm:w-auto">
                        <MessageSquare className="w-4 h-4" />
                        Messages
                      </Button>
                    </Link>
                    {t.status === "accepted" && (
                      <Button size="sm" variant="hunt" onClick={() => markCompleted(t.id)}>
                        Mark complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTrips;
