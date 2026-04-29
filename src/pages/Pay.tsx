import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Crosshair, Check, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Pay = () => {
  const { user, signOut, refresh, hasPaid } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.get("status") === "success") {
      toast.success("Payment received! Confirming…");
      // Poll a few times for webhook to land
      let tries = 0;
      const id = setInterval(async () => {
        await refresh();
        tries++;
        if (tries > 8) clearInterval(id);
      }, 1500);
      return () => clearInterval(id);
    }
    if (params.get("status") === "cancelled") {
      toast.info("Payment cancelled");
    }
  }, [params, refresh]);

  useEffect(() => {
    if (hasPaid) navigate("/scouting", { replace: true });
  }, [hasPaid, navigate]);

  const handlePay = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("create-registration-checkout");
    setLoading(false);
    if (error || !data?.url) {
      toast.error(error?.message || "Could not start checkout");
      return;
    }
    window.location.href = data.url;
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 shadow-deep text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-gold grid place-items-center shadow-glow mb-4">
          <Crosshair className="w-6 h-6 text-accent-foreground" strokeWidth={2.5} />
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">One last step, hunter</h1>
        <p className="text-foreground-dim text-sm mb-6">
          A one-time <span className="text-accent font-semibold">$5 USD</span> registration fee unlocks the full Zimbabwe Hunting Adventures app — guide directory, trip planning, and bookings.
        </p>

        <ul className="text-left text-sm space-y-2 mb-8">
          {["Browse 23 species in the Scouting field guide", "Build and submit unlimited trip requests", "Direct messaging with licensed guides", "Lifetime access — no subscriptions"].map(item => (
            <li key={item} className="flex items-start gap-2">
              <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Button variant="hunt" size="lg" className="w-full" onClick={handlePay} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pay $5 & unlock"}
        </Button>
        <div className="flex justify-between text-xs text-foreground-dim mt-4">
          <button onClick={refresh} className="hover:text-accent">Refresh status</button>
          <button onClick={async () => { await signOut(); navigate("/"); }} className="hover:text-accent">Sign out</button>
        </div>
        <p className="text-[11px] text-foreground-dim mt-6">Signed in as {user?.email}</p>
      </div>
    </div>
  );
};

export default Pay;
