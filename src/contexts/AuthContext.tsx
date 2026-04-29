import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "guide" | "client";

type AuthCtx = {
  session: Session | null;
  user: User | null;
  role: AppRole | null;
  hasPaid: boolean;
  guideStatus: "pending" | "approved" | "rejected" | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [guideStatus, setGuideStatus] = useState<AuthCtx["guideStatus"]>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const [{ data: roles }, { data: payments }, { data: guide }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", uid),
      supabase.from("client_payments").select("status").eq("user_id", uid).eq("status", "paid").limit(1),
      supabase.from("guides").select("approval_status").eq("user_id", uid).maybeSingle(),
    ]);
    setRole((roles?.[0]?.role as AppRole) ?? null);
    setHasPaid((payments?.length ?? 0) > 0);
    setGuideStatus((guide?.approval_status as AuthCtx["guideStatus"]) ?? null);
  };

  const refresh = async () => {
    if (user) await loadProfile(user.id);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        // defer to avoid deadlock
        setTimeout(() => loadProfile(s.user.id), 0);
      } else {
        setRole(null); setHasPaid(false); setGuideStatus(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{ session, user, role, hasPaid, guideStatus, loading, refresh, signOut }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
