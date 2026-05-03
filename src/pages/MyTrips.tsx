import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Calendar, Users, MessageSquare, Package, Check, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { animals } from "@/data/animals";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TripStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled";

type TripRow = {
  id: string;
  client_id: string;
  guide_id: string;
  animal_ids: number[];
  package_id: string | null;
  preferred_start: string | null;
  preferred_end: string | null;
  party_size: number;
  message: string | null;
  status: TripStatus;
  guide_response: string | null;
  created_at: string;
};

type Guide = { id: string; full_name: string };
type Profile = { user_id: string; display_name: string | null };
type HuntingPackage = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: string;
  duration_days: number;
  inclusions: string[];
  exclusions: string[];
};

const formatPrice = (cents: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);

const statusVariant: Record<TripStatus, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  accepted: "default",
  declined: "destructive",
  completed: "default",
  cancelled: "outline",
};

const MyTrips = () => {
  const { user, role } = useAuth();
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [guidesById, setGuidesById] = useState<Record<string, Guide>>({});
  const [clientsById, setClientsById] = useState<Record<string, Profile>>({});
  const [packagesById, setPackagesById] = useState<Record<string, HuntingPackage>>({});
  const [loading, setLoading] = useState(true);

  const isGuide = role === "guide";

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: rows, error } = await supabase
      .from("trip_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const list = (rows ?? []) as TripRow[];
    setTrips(list);

    if (isGuide) {
      const clientIds = Array.from(new Set(list.map((t) => t.client_id)));
      if (clientIds.length) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, display_name")
          .in("user_id", clientIds);
        const map: Record<string, Profile> = {};
        (profiles ?? []).forEach((p) => (map[p.user_id] = p));
        setClientsById(map);
      }
    } else {
      const guideIds = Array.from(new Set(list.map((t) => t.guide_id)));
      if (guideIds.length) {
        const { data: gs } = await supabase
          .from("guides")
          .select("id, full_name")
          .in("id", guideIds);
        const map: Record<string, Guide> = {};
        (gs ?? []).forEach((g) => (map[g.id] = g));
        setGuidesById(map);
      }
    }

    const pkgIds = Array.from(new Set(list.map((t) => t.package_id).filter(Boolean) as string[]));
    if (pkgIds.length) {
      const { data: pkgs } = await supabase
        .from("hunting_packages")
        .select("*")
        .in("id", pkgIds);
      const map: Record<string, HuntingPackage> = {};
      (pkgs ?? []).forEach((p) => (map[p.id] = p as HuntingPackage));
      setPackagesById(map);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isGuide]);

  const updateStatus = async (id: string, status: TripStatus) => {
    const { error } = await supabase.from("trip_requests").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Trip ${status}`);
    load();
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-foreground-dim" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>

        <h1 className="font-display text-3xl font-black mb-2">
          {isGuide ? "Trip Requests" : "My Trips"}
        </h1>
        <p className="text-foreground-dim mb-8">
          {isGuide ? "Hunters who want to book you." : "Your hunt requests and their status."}
        </p>

        {trips.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-foreground-dim">
              {isGuide ? "No requests yet." : "You haven't sent any trip requests yet."}
            </p>
            {!isGuide && (
              <Button asChild variant="hunt" className="mt-4">
                <Link to="/guides">Find a guide</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((t) => (
              <TripCard
                key={t.id}
                trip={t}
                title={
                  isGuide
                    ? clientsById[t.client_id]?.display_name ?? "Hunter"
                    : guidesById[t.guide_id]?.full_name ?? "Guide"
                }
                pkg={t.package_id ? packagesById[t.package_id] : undefined}
                isGuide={isGuide}
                onUpdate={updateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TripCard = ({
  trip,
  title,
  pkg,
  isGuide,
  onUpdate,
}: {
  trip: TripRow;
  title: string;
  pkg?: HuntingPackage;
  isGuide: boolean;
  onUpdate: (id: string, status: TripStatus) => void;
}) => {
  const animalNames = trip.animal_ids
    .map((id) => animals.find((a) => a.id === id)?.name)
    .filter(Boolean) as string[];

  return (
    <div className="bg-card border border-border rounded-lg p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground-dim">
            {isGuide ? "Hunter" : "Guide"}
          </p>
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <p className="text-xs text-foreground-dim mt-1">
            Sent {new Date(trip.created_at).toLocaleDateString()}
          </p>
        </div>
        <Badge variant={statusVariant[trip.status]} className="capitalize">
          {trip.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
        {(trip.preferred_start || trip.preferred_end) && (
          <div className="flex items-center gap-2 text-foreground-dim">
            <Calendar className="w-4 h-4 text-accent" />
            {trip.preferred_start ?? "?"} → {trip.preferred_end ?? "?"}
          </div>
        )}
        <div className="flex items-center gap-2 text-foreground-dim">
          <Users className="w-4 h-4 text-accent" />
          Party of {trip.party_size}
        </div>
      </div>

      {pkg && (
        <div className="mb-4 bg-muted/40 border border-border rounded-md p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-accent" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground-dim">Package</p>
                <h3 className="font-display text-base font-bold">{pkg.name}</h3>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="font-display text-lg font-black text-accent">
                {formatPrice(pkg.price_cents, pkg.currency)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-foreground-dim flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" /> {pkg.duration_days} day{pkg.duration_days === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          {pkg.description && (
            <p className="text-xs text-foreground-dim mb-2">{pkg.description}</p>
          )}
          {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && (
            <div className="grid sm:grid-cols-2 gap-3 text-xs mt-2">
              {pkg.inclusions.length > 0 && (
                <div>
                  <p className="font-semibold text-foreground mb-1">Included</p>
                  <ul className="space-y-1">
                    {pkg.inclusions.map((it) => (
                      <li key={it} className="flex items-start gap-1.5 text-foreground-dim">
                        <Check className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions.length > 0 && (
                <div>
                  <p className="font-semibold text-foreground mb-1">Not included</p>
                  <ul className="space-y-1">
                    {pkg.exclusions.map((it) => (
                      <li key={it} className="flex items-start gap-1.5 text-foreground-dim">
                        <X className="w-3 h-3 text-destructive mt-0.5 shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {animalNames.length > 0 && (
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.2em] text-foreground-dim mb-2">Hunting list</p>
          <div className="flex flex-wrap gap-2">
            {animalNames.map((n) => (
              <span key={n} className="text-xs bg-muted px-2 py-1 rounded">{n}</span>
            ))}
          </div>
        </div>
      )}

      {trip.message && (
        <div className="mb-4 border-l-2 border-accent/40 pl-3">
          <p className="text-xs uppercase tracking-[0.2em] text-foreground-dim mb-1 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3" /> Message
          </p>
          <p className="text-sm text-foreground whitespace-pre-line">{trip.message}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
        {trip.status !== "cancelled" && trip.status !== "declined" && (
          <Button asChild size="sm" variant="outline">
            <Link to={`/trips/${trip.id}/messages`}>
              <MessageSquare className="w-4 h-4" /> Message
            </Link>
          </Button>
        )}
        {isGuide && trip.status === "pending" && (
          <>
            <Button size="sm" variant="hunt" onClick={() => onUpdate(trip.id, "accepted")}>
              Accept
            </Button>
            <Button size="sm" variant="outline" onClick={() => onUpdate(trip.id, "declined")}>
              Decline
            </Button>
          </>
        )}
        {isGuide && trip.status === "accepted" && (
          <Button size="sm" variant="hunt" onClick={() => onUpdate(trip.id, "completed")}>
            Mark Completed
          </Button>
        )}
        {!isGuide && trip.status === "pending" && (
          <Button size="sm" variant="outline" onClick={() => onUpdate(trip.id, "cancelled")}>
            Cancel Request
          </Button>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
