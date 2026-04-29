import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Crosshair, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<"client" | "guide">("client");

  useEffect(() => {
    if (!authLoading && user) {
      const from = (location.state as any)?.from || "/";
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location.state]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName, role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created!");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Could not sign in with Google");
    }
    // if redirected, browser navigates away; if tokens received, AuthContext picks up
  };

  return (
    <div className="min-h-screen bg-background grid place-items-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-full bg-gradient-gold grid place-items-center shadow-glow">
            <Crosshair className="w-5 h-5 text-accent-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-display text-foreground font-bold tracking-wide">ZHA</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-dim">Zimbabwe Hunting Adventures</p>
          </div>
        </Link>

        <div className="bg-card border border-border rounded-lg p-6 shadow-deep">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="si-pwd">Password</Label>
                  <Input id="si-pwd" type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
                <Button type="submit" variant="hunt" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" value={displayName} onChange={e => setDisplayName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div>
                  <Label htmlFor="su-pwd">Password</Label>
                  <Input id="su-pwd" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" />
                  <p className="text-xs text-foreground-dim mt-1">Min 8 characters.</p>
                </div>
                <div>
                  <Label className="mb-2 block">I am registering as</Label>
                  <RadioGroup value={role} onValueChange={(v) => setRole(v as "client" | "guide")} className="grid grid-cols-2 gap-3">
                    <label className={`border rounded-md p-3 cursor-pointer text-center ${role === "client" ? "border-accent bg-accent/10" : "border-border"}`}>
                      <RadioGroupItem value="client" className="sr-only" />
                      <p className="font-semibold text-sm">Hunter</p>
                      <p className="text-[11px] text-foreground-dim mt-1">$5 one-time fee</p>
                    </label>
                    <label className={`border rounded-md p-3 cursor-pointer text-center ${role === "guide" ? "border-accent bg-accent/10" : "border-border"}`}>
                      <RadioGroupItem value="guide" className="sr-only" />
                      <p className="font-semibold text-sm">Guide</p>
                      <p className="text-[11px] text-foreground-dim mt-1">Free, requires approval</p>
                    </label>
                  </RadioGroup>
                </div>
                <Button type="submit" variant="hunt" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider"><span className="bg-card px-2 text-foreground-dim">or</span></div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-xs text-foreground-dim mt-6">
          <Link to="/" className="hover:text-accent">← Back to home</Link>
        </p>
      </div>
    </div>
  );
};

export default Auth;
