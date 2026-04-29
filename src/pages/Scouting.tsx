import { useMemo, useState } from "react";
import { Search, ShoppingBag, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { animals, type Animal } from "@/data/animals";
import { AnimalDetailSheet } from "@/components/AnimalDetailSheet";
import { useTripList } from "@/store/tripList";
import { Input } from "@/components/ui/input";

const Scouting = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Animal | null>(null);
  const tripCount = useTripList((s) => s.list.length);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return animals;
    return animals.filter((a) =>
      [a.name, a.latinName, a.afrikaans, a.shona].some((f) => f.toLowerCase().includes(q)),
    );
  }, [query]);

  return (
    <div className="relative min-h-screen pb-20">
      {/* Binoculars overlay (decorative) */}
      <div className="binoculars" aria-hidden>
        <span className="crosshair-bracket animate-scan" style={{ top: "32%", left: "26%", borderRight: "none", borderBottom: "none" }} />
        <span className="crosshair-bracket animate-scan" style={{ top: "32%", right: "26%", borderLeft: "none", borderBottom: "none" }} />
        <span className="crosshair-bracket animate-scan" style={{ bottom: "32%", left: "26%", borderRight: "none", borderTop: "none" }} />
        <span className="crosshair-bracket animate-scan" style={{ bottom: "32%", right: "26%", borderLeft: "none", borderTop: "none" }} />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 py-4">
        <Link
          to="/"
          className="w-10 h-10 grid place-items-center rounded-full bg-background-deep/70 backdrop-blur text-foreground-dim hover:text-accent transition-colors ring-1 ring-border/40"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold">Scouting</p>
          <h1 className="font-display text-base text-foreground text-shadow-soft">Find Your Quarry</h1>
        </div>
        <button
          className="relative w-10 h-10 grid place-items-center rounded-full bg-background-deep/70 backdrop-blur text-foreground-dim hover:text-accent transition-colors ring-1 ring-border/40"
          aria-label="My hunting list"
        >
          <ShoppingBag className="w-5 h-5" />
          {tripCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 grid place-items-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
              {tripCount}
            </span>
          )}
        </button>
      </header>

      {/* Search bar — sits below the binoculars area */}
      <div className="relative z-10 mt-[36vh] sm:mt-[34vh] px-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the herd — kudu, sable, nyati…"
            className="pl-11 h-12 bg-surface/90 backdrop-blur border-border/60 text-foreground placeholder:text-foreground-muted focus-visible:ring-accent rounded-xl"
          />
        </div>
      </div>

      {/* Results */}
      <main className="relative z-10 px-4 mt-6 max-w-5xl mx-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-foreground-dim py-12">No animals match your tracks. Try another name.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((a) => (
              <AnimalCard key={a.id} animal={a} onSelect={() => setSelected(a)} />
            ))}
          </div>
        )}
      </main>

      <AnimalDetailSheet
        animal={selected}
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </div>
  );
};

const AnimalCard = ({ animal, onSelect }: { animal: Animal; onSelect: () => void }) => {
  const inList = useTripList((s) => s.list.includes(animal.id));
  return (
    <button
      onClick={onSelect}
      className="group relative text-left rounded-xl overflow-hidden bg-surface shadow-card ring-1 ring-border/40 hover:ring-accent/60 hover:-translate-y-0.5 transition-all duration-300 animate-fade-in"
    >
      <div className="aspect-[4/5] overflow-hidden bg-background-deep">
        <img
          src={animal.image}
          alt={animal.name}
          width={400}
          height={500}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-deep via-background-deep/30 to-transparent pointer-events-none" />
      </div>
      {inList && (
        <span className="absolute top-2 right-2 text-[9px] uppercase tracking-wider font-bold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
          On List
        </span>
      )}
      <div className="absolute bottom-0 inset-x-0 p-3">
        <h3 className="font-display font-bold text-foreground text-sm sm:text-base leading-tight">
          {animal.name}
        </h3>
        <p className="font-display italic text-foreground-dim text-[11px] sm:text-xs truncate">
          {animal.latinName}
        </p>
      </div>
    </button>
  );
};

export default Scouting;
