import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useTripList } from "@/store/tripList";
import { animals } from "@/data/animals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  preferred_start: z.string().optional(),
  preferred_end: z.string().optional(),
  party_size: z.number().int().min(1).max(20),
  message: z.string().trim().max(1000).optional(),
});

const RequestTrip = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const tripList = useTripList((s) => s.list);
  const clearList = useTripList((s) => s.clear);

  const [guideName, setGuideName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [party, setParty] = useState(1);
  const [message, setMessage] = useState("");

  const selectedAnimals = animals.filter((a) => tripList.includes(a.id));

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from("guides")
        .select("full_name")
        .eq("id", id)
        .eq("approval_status", "approved")
        .maybeSingle();
      setGuideName(data?.full_name ?? "");
      setLoading(false);
    })();
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;
    if (tripList.length === 0) {
      toast.error("Add animals to your hunting list first.");
      return;
    }
    const parsed = schema.safeParse({
      preferred_start: start || undefined,
      preferred_end: end || undefined,
      party_size: party,
      message: message || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("trip_requests").insert({
      client_id: user.id,
      guide_id: id,
      animal_ids: tripList,
      preferred_start: start || null,
      preferred_end: end || null,
      party_size: party,
      message: message || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Trip request sent!");
    clearList();
    navigate("/my-trips");
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
      <div className="container max-w-2xl">
        <Link to={`/guides/${id}`} className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to guide
        </Link>

        <h1 className="font-display text-3xl font-black mb-2">Request Trip</h1>
        <p className="text-foreground-dim mb-8">
          Send your hunting list to <span className="text-foreground font-semibold">{guideName}</span>.
        </p>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-foreground-dim mb-3">
            Your hunting list ({selectedAnimals.length})
          </p>
          {selectedAnimals.length === 0 ? (
            <p className="text-foreground-dim text-sm">
              No animals selected.{" "}
              <Link to="/scouting" className="text-accent hover:underline">Browse scouting</Link>
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedAnimals.map((a) => (
                <span key={a.id} className="text-sm bg-muted text-foreground px-2.5 py-1 rounded">
                  {a.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="bg-card border border-border rounded-lg p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start">Preferred start</Label>
              <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="end">Preferred end</Label>
              <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="mt-1.5" />
            </div>
          </div>

          <div>
            <Label htmlFor="party">Party size</Label>
            <Input
              id="party"
              type="number"
              min={1}
              max={20}
              value={party}
              onChange={(e) => setParty(parseInt(e.target.value) || 1)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="message">Message to guide (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="Tell the guide about your experience, expectations, special requests…"
              className="mt-1.5"
            />
            <p className="text-xs text-foreground-dim mt-1">{message.length}/1000</p>
          </div>

          <Button type="submit" variant="hunt" size="lg" disabled={submitting || tripList.length === 0} className="w-full">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Request
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RequestTrip;
