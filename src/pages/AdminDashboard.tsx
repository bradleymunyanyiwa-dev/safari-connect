import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Users, Compass, DollarSign, Mail, Hourglass } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Stats = {
  pendingGuides: number;
  approvedGuides: number;
  totalTrips: number;
  pendingTrips: number;
  paidClients: number;
  revenueCents: number;
  unreadMessages: number;
};

const initialStats: Stats = {
  pendingGuides: 0,
  approvedGuides: 0,
  totalTrips: 0,
  pendingTrips: 0,
  paidClients: 0,
  revenueCents: 0,
  unreadMessages: 0,
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [pg, ag, tt, pt, pc, rev, um] = await Promise.all([
          supabase.from("guides").select("id", { count: "exact", head: true }).eq("approval_status", "pending"),
          supabase.from("guides").select("id", { count: "exact", head: true }).eq("approval_status", "approved"),
          supabase.from("trip_requests").select("id", { count: "exact", head: true }),
          supabase.from("trip_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("client_payments").select("user_id", { count: "exact", head: true }).eq("status", "paid"),
          supabase.from("client_payments").select("amount_cents").eq("status", "paid"),
          supabase.from("messages").select("id", { count: "exact", head: true }).is("read_at", null),
        ]);
        const revenueCents = (rev.data ?? []).reduce((sum, r: { amount_cents: number }) => sum + (r.amount_cents ?? 0), 0);
        setStats({
          pendingGuides: pg.count ?? 0,
          approvedGuides: ag.count ?? 0,
          totalTrips: tt.count ?? 0,
          pendingTrips: pt.count ?? 0,
          paidClients: pc.count ?? 0,
          revenueCents,
          unreadMessages: um.count ?? 0,
        });
      } catch (e) {
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards: { label: string; value: string | number; icon: typeof Users; tone: string }[] = [
    { label: "Pending guide approvals", value: stats.pendingGuides, icon: Hourglass, tone: "text-accent" },
    { label: "Approved guides", value: stats.approvedGuides, icon: ShieldCheck, tone: "text-success" },
    { label: "Total trip requests", value: stats.totalTrips, icon: Compass, tone: "text-foreground" },
    { label: "Pending trip requests", value: stats.pendingTrips, icon: Hourglass, tone: "text-accent" },
    { label: "Paid clients", value: stats.paidClients, icon: Users, tone: "text-foreground" },
    { label: "Revenue (USD)", value: `$${(stats.revenueCents / 100).toFixed(2)}`, icon: DollarSign, tone: "text-success" },
    { label: "Unread messages", value: stats.unreadMessages, icon: Mail, tone: "text-foreground-dim" },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="container max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <header className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Admin</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold">Camp Headquarters</h1>
          <p className="text-foreground-dim text-sm mt-1">Operations overview for the outfit.</p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-card border border-border/60 rounded-xl p-4 shadow-card">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-foreground-dim">{c.label}</span>
                <c.icon className={`w-4 h-4 ${c.tone}`} />
              </div>
              <p className="font-display text-2xl sm:text-3xl font-bold mt-2">
                {loading ? "—" : c.value}
              </p>
            </div>
          ))}
        </section>

        <section className="grid sm:grid-cols-2 gap-3">
          <Link
            to="/admin/guides"
            className="block bg-card border border-border/60 rounded-xl p-5 hover:border-accent/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <h2 className="font-display font-bold text-lg">Guide approvals</h2>
            </div>
            <p className="text-sm text-foreground-dim">
              Review and approve professional hunters applying to the platform.
            </p>
            {stats.pendingGuides > 0 && (
              <span className="inline-block mt-3 text-[10px] uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">
                {stats.pendingGuides} pending
              </span>
            )}
          </Link>

          <Link
            to="/admin/trips"
            className="block bg-card border border-border/60 rounded-xl p-5 hover:border-accent/60 transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <Compass className="w-5 h-5 text-accent" />
              <h2 className="font-display font-bold text-lg">Trip requests</h2>
            </div>
            <p className="text-sm text-foreground-dim">
              Oversee every safari request between hunters and guides.
            </p>
            {stats.pendingTrips > 0 && (
              <span className="inline-block mt-3 text-[10px] uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">
                {stats.pendingTrips} pending
              </span>
            )}
          </Link>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
