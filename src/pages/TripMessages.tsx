import { useEffect, useRef, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  trip_request_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

type TripMeta = {
  id: string;
  client_id: string;
  guide_id: string;
  status: string;
};

const bodySchema = z.string().trim().min(1, "Message can't be empty").max(4000, "Too long");

const TripMessages = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const [trip, setTrip] = useState<TripMeta | null>(null);
  const [counterpartyName, setCounterpartyName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id || !user) return;
    let cancelled = false;

    (async () => {
      const { data: tripRow, error: tripErr } = await supabase
        .from("trip_requests")
        .select("id, client_id, guide_id, status")
        .eq("id", id)
        .maybeSingle();

      if (cancelled) return;
      if (tripErr || !tripRow) {
        toast.error(tripErr?.message ?? "Trip not found");
        setLoading(false);
        return;
      }
      setTrip(tripRow);

      // Resolve counterparty name
      const isClient = tripRow.client_id === user.id;
      if (isClient) {
        const { data: g } = await supabase
          .from("guides")
          .select("full_name")
          .eq("id", tripRow.guide_id)
          .maybeSingle();
        setCounterpartyName(g?.full_name ?? "Guide");
      } else {
        const { data: p } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", tripRow.client_id)
          .maybeSingle();
        setCounterpartyName(p?.display_name ?? "Hunter");
      }

      const { data: msgs, error: msgErr } = await supabase
        .from("messages")
        .select("*")
        .eq("trip_request_id", id)
        .order("created_at", { ascending: true });

      if (cancelled) return;
      if (msgErr) toast.error(msgErr.message);
      setMessages((msgs ?? []) as Message[]);
      setLoading(false);

      // Mark unread as read (best-effort)
      const unread = (msgs ?? []).filter((m) => !m.read_at && m.sender_id !== user.id);
      if (unread.length) {
        await supabase
          .from("messages")
          .update({ read_at: new Date().toISOString() })
          .in("id", unread.map((m) => m.id));
      }
    })();

    // Realtime
    const channel = supabase
      .channel(`messages-${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `trip_request_id=eq.${id}` },
        (payload) => {
          const m = payload.new as Message;
          setMessages((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m]));
          if (m.sender_id !== user.id) {
            supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", m.id)
              .then(() => undefined);
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [id, user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = async () => {
    if (!user || !id) return;
    const parsed = bodySchema.safeParse(draft);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      trip_request_id: id,
      sender_id: user.id,
      body: parsed.data,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setDraft("");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-foreground-dim" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!trip) {
    return (
      <div className="min-h-screen grid place-items-center text-foreground-dim">
        Conversation unavailable.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border bg-card">
        <div className="container max-w-3xl p-4 sm:p-6">
          <Link
            to="/my-trips"
            className="inline-flex items-center gap-2 text-sm text-foreground-dim hover:text-accent mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> My Trips
          </Link>
          <h1 className="font-display text-2xl sm:text-3xl font-black">{counterpartyName}</h1>
          <p className="text-xs text-foreground-dim uppercase tracking-[0.2em] mt-1">
            Trip · {trip.status}
          </p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="container max-w-3xl p-4 sm:p-6 space-y-3">
          {messages.length === 0 ? (
            <p className="text-center text-foreground-dim text-sm py-12">
              No messages yet. Say hello.
            </p>
          ) : (
            messages.map((m) => {
              const mine = m.sender_id === user.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2.5 ${
                      mine
                        ? "bg-accent text-accent-foreground"
                        : "bg-card border border-border text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{m.body}</p>
                    <p className={`text-[10px] mt-1 ${mine ? "opacity-70" : "text-foreground-dim"}`}>
                      {new Date(m.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card">
        <div className="container max-w-3xl p-4 sm:p-6">
          <div className="flex gap-2 items-end">
            <Textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Write a message…"
              rows={2}
              maxLength={4000}
              className="resize-none"
            />
            <Button
              variant="hunt"
              size="lg"
              onClick={send}
              disabled={sending || draft.trim().length === 0}
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[10px] text-foreground-dim mt-2">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripMessages;
