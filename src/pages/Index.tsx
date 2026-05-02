import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, BookOpen, Users, Crosshair, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero-savanna.jpg";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, role } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Sun setting over the Zimbabwean savanna with acacia trees"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero-fade" />
        <div className="absolute inset-0 bg-background-deep/45 sm:bg-background-deep/35" />

        {/* Top brand bar */}
        <div className="absolute top-0 inset-x-0 z-10 px-4 sm:px-5 py-4 sm:py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-gold grid place-items-center shadow-glow">
              <Crosshair className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-foreground font-bold text-sm tracking-wide">ZHA</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-dim">Est. 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {role === "admin" && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-transparent gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Admin
                </Button>
              </Link>
            )}
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-foreground-dim hover:text-accent hover:bg-transparent">
                {user ? "Account" : "Sign in"}
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative z-10 container pb-10 sm:pb-24 animate-fade-in-up">
          <p className="text-accent font-bold tracking-[0.3em] text-[10px] sm:text-xs uppercase mb-3 sm:mb-4">
            Zimbabwe · Trophy Hunting
          </p>
          <h1 className="font-display font-black text-foreground text-shadow-soft leading-[0.95] text-[2.75rem] sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            The hunt of <span className="text-accent">a lifetime</span> begins here.
          </h1>
          <p className="mt-4 sm:mt-6 text-foreground-dim text-sm sm:text-lg max-w-xl text-shadow-soft">
            Scout 23 species, build your custom safari and book directly with licensed
            professional hunters across Zimbabwe.
          </p>

          {/* Mobile-first CTA stack */}
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:flex-wrap gap-2.5 sm:gap-3">
            <Link to="/scouting" className="w-full sm:w-auto">
              <Button variant="hunt" size="xl" className="w-full sm:w-auto">
                <Compass className="w-5 h-5" />
                Start Scouting
              </Button>
            </Link>
            <Link to="/guides" className="w-full sm:w-auto">
              <Button variant="wood" size="xl" className="w-full sm:w-auto">
                <Users className="w-5 h-5" />
                View Guides
              </Button>
            </Link>
            {user && (
              <Link to="/my-trips" className="w-full sm:w-auto">
                <Button variant="wood" size="xl" className="w-full sm:w-auto">
                  <Briefcase className="w-5 h-5" />
                  My Trips
                </Button>
              </Link>
            )}
          </div>

          {/* Scroll hint on mobile */}
          <div className="mt-8 sm:hidden flex justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-foreground-dim animate-pulse">
              Scroll ↓
            </span>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="container py-12 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-accent font-bold tracking-[0.25em] text-[10px] sm:text-xs uppercase mb-3">The Field Guide</p>
          <h2 className="font-display font-black text-2xl sm:text-4xl md:text-5xl text-foreground leading-tight">
            From spoor to trophy — all in one place.
          </h2>
          <p className="mt-3 sm:mt-4 text-foreground-dim text-sm sm:text-base">
            We've digitised the African hunting safari. Browse, plan and book with the trust of
            a leather-bound field guide and the speed of a modern app.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <FeatureLink
            to="/scouting"
            icon={<BookOpen className="w-6 h-6" />}
            title="The Field Guide"
            body="Twenty-three species — Greater Kudu to Cape Buffalo — with vernacular names, habitat, diet and range."
            cta="Open the guide"
          />
          <FeatureLink
            to={user ? "/my-trips" : "/scouting"}
            icon={<Compass className="w-6 h-6" />}
            title="Plan Your Safari"
            body="Add animals to your hunting list, set the dates and party size — your custom package, ready to book."
            cta={user ? "Manage trips" : "Start planning"}
          />
          <FeatureLink
            to="/guides"
            icon={<Users className="w-6 h-6" />}
            title="Vetted Professionals"
            body="Licensed Zimbabwean PHs and outfitters. Verify credentials before you ever board the plane."
            cta="Browse guides"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-16 sm:pb-24">
        <div className="wood-surface rounded-2xl p-6 sm:p-12 text-center ring-1 ring-border/50">
          <h3 className="font-display font-black text-xl sm:text-3xl text-foreground">
            Ready to head into the bush?
          </h3>
          <p className="text-foreground-dim mt-2 sm:mt-3 max-w-md mx-auto text-sm sm:text-base">
            Open the field guide and start picking your quarry.
          </p>
          <Link to="/scouting" className="block sm:inline-block mt-5 sm:mt-6">
            <Button variant="gold" size="xl" className="w-full sm:w-auto">
              <Crosshair className="w-5 h-5" />
              Enter Scouting Mode
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/40 py-6 sm:py-8 text-center text-[10px] sm:text-xs text-foreground-muted tracking-wider uppercase">
        Zimbabwe Hunting Adventures · v1.0
      </footer>
    </div>
  );
};

const FeatureLink = ({
  to,
  icon,
  title,
  body,
  cta,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
}) => (
  <Link
    to={to}
    className="wood-surface rounded-xl p-5 sm:p-6 ring-1 ring-border/40 hover:ring-accent/60 transition-all hover:-translate-y-1 duration-300 flex flex-col group"
  >
    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-gold grid place-items-center text-accent-foreground mb-3 sm:mb-4 shadow-button">
      {icon}
    </div>
    <h3 className="font-display font-bold text-base sm:text-lg text-foreground mb-1.5 sm:mb-2">{title}</h3>
    <p className="text-sm text-foreground-dim leading-relaxed flex-1">{body}</p>
    <span className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-accent font-bold group-hover:gap-2.5 transition-all">
      {cta} <ArrowRight className="w-3.5 h-3.5" />
    </span>
  </Link>
);

export default Index;
