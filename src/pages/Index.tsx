import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, BookOpen, Users, Crosshair } from "lucide-react";
import heroImg from "@/assets/hero-savanna.jpg";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-end overflow-hidden">
        <img
          src={heroImg}
          alt="Sun setting over the Zimbabwean savanna with acacia trees"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero-fade" />
        <div className="absolute inset-0 bg-background-deep/35" />

        {/* Top brand bar */}
        <div className="absolute top-0 inset-x-0 z-10 px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-gold grid place-items-center shadow-glow">
              <Crosshair className="w-4 h-4 text-accent-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="font-display text-foreground font-bold text-sm tracking-wide">ZHA</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-foreground-dim">Est. 2026</p>
            </div>
          </div>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="text-foreground-dim hover:text-accent hover:bg-transparent">
              Sign in
            </Button>
          </Link>
        </div>

        <div className="relative z-10 container pb-16 sm:pb-24 animate-fade-in-up">
          <p className="text-accent font-bold tracking-[0.3em] text-xs uppercase mb-4">
            Zimbabwe · Trophy Hunting
          </p>
          <h1 className="font-display font-black text-foreground text-shadow-soft leading-[0.95] text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl">
            The hunt of <span className="text-accent">a lifetime</span> begins here.
          </h1>
          <p className="mt-6 text-foreground-dim text-base sm:text-lg max-w-xl text-shadow-soft">
            Scout 23 species, build your custom safari and book directly with licensed
            professional hunters across Zimbabwe and Southern Africa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/scouting">
              <Button variant="hunt" size="xl">
                <Compass className="w-5 h-5" />
                Start Scouting
              </Button>
            </Link>
            <Link to="/guides">
              <Button variant="wood" size="xl">
                View Guides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="container py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-accent font-bold tracking-[0.25em] text-xs uppercase mb-3">The Field Guide</p>
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-foreground leading-tight">
            From spoor to trophy — all in one place.
          </h2>
          <p className="mt-4 text-foreground-dim">
            We've digitised the African hunting safari. Browse, plan and book with the trust of
            a leather-bound field guide and the speed of a modern app.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <Feature
            icon={<BookOpen className="w-6 h-6" />}
            title="The Field Guide"
            body="Twenty-three species — Greater Kudu to Cape Buffalo — with vernacular names, habitat, diet and range."
          />
          <Feature
            icon={<Compass className="w-6 h-6" />}
            title="Plan Your Safari"
            body="Add animals to your hunting list, set the dates and party size — your custom package, ready to book."
          />
          <Feature
            icon={<Users className="w-6 h-6" />}
            title="Vetted Professionals"
            body="Licensed Zimbabwean PHs and outfitters. Verify credentials before you ever board the plane."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="wood-surface rounded-2xl p-8 sm:p-12 text-center ring-1 ring-border/50">
          <h3 className="font-display font-black text-2xl sm:text-3xl text-foreground">
            Ready to head into the bush?
          </h3>
          <p className="text-foreground-dim mt-3 max-w-md mx-auto">
            Open the field guide and start picking your quarry.
          </p>
          <Link to="/scouting" className="inline-block mt-6">
            <Button variant="gold" size="xl">
              <Crosshair className="w-5 h-5" />
              Enter Scouting Mode
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/40 py-8 text-center text-xs text-foreground-muted tracking-wider uppercase">
        Zimbabwe Hunting Adventures · v1.0
      </footer>
    </div>
  );
};

const Feature = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <div className="wood-surface rounded-xl p-6 ring-1 ring-border/40 hover:ring-accent/40 transition-all hover:-translate-y-1 duration-300">
    <div className="w-12 h-12 rounded-lg bg-gradient-gold grid place-items-center text-accent-foreground mb-4 shadow-button">
      {icon}
    </div>
    <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
    <p className="text-sm text-foreground-dim leading-relaxed">{body}</p>
  </div>
);

export default Index;
