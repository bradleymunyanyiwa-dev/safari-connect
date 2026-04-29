import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Plus, Check, Leaf, MapPin, Trees } from "lucide-react";
import type { Animal } from "@/data/animals";
import { useTripList } from "@/store/tripList";
import { toast } from "sonner";

interface Props {
  animal: Animal | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export const AnimalDetailSheet = ({ animal, open, onOpenChange }: Props) => {
  const list = useTripList((s) => s.list);
  const toggle = useTripList((s) => s.toggle);

  if (!animal) return null;
  const inList = list.includes(animal.id);

  const handleToggle = () => {
    toggle(animal.id);
    toast(inList ? `Removed ${animal.name} from your trip` : `Added ${animal.name} to your trip`, {
      description: inList ? undefined : "Build your hunting list before booking.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="paper-card max-w-xl p-0 overflow-hidden gap-0 border-none rounded-2xl sm:rounded-2xl [&>button.absolute]:hidden"
      >
        {/* Header band */}
        <div className="flex items-start gap-4 p-5 pb-3 border-b border-paper-ink/15">
          <img
            src={animal.image}
            alt={animal.name}
            width={140}
            height={140}
            loading="lazy"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-xl object-cover ring-2 ring-paper-ink/20 shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0 pr-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-paper-ink/60 font-bold">
              {animal.category}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-paper-ink leading-tight">
              {animal.name}
            </h2>
            <p className="font-display italic text-paper-ink/70 text-sm mt-1">
              {animal.latinName}
            </p>
          </div>
          <DialogClose asChild>
            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-paper-ink/10 hover:bg-paper-ink/20 grid place-items-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-paper-ink" />
            </button>
          </DialogClose>
        </div>

        {/* Vernacular names */}
        <div className="grid grid-cols-2 gap-3 px-5 pt-4 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-paper-ink/55 font-bold">Afrikaans</p>
            <p className="font-display text-paper-ink">{animal.afrikaans}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-paper-ink/55 font-bold">Shona</p>
            <p className="font-display text-paper-ink">{animal.shona}</p>
          </div>
        </div>

        <div className="px-5 pt-5 space-y-3 text-sm">
          <Row icon={<Trees className="w-4 h-4" />} label="Habitat" value={animal.habitat} />
          <Row icon={<Leaf className="w-4 h-4" />} label="Diet" value={animal.diet} />
          <Row icon={<MapPin className="w-4 h-4" />} label="Range" value={animal.range} />
        </div>

        <div className="px-5 pt-4 pb-5">
          <p className="font-display italic text-paper-ink/85 text-[15px] leading-relaxed">
            {animal.description}
          </p>
        </div>

        <div className="bg-paper-ink/5 p-4 border-t border-paper-ink/15">
          <Button
            variant={inList ? "wood" : "hunt"}
            size="lg"
            onClick={handleToggle}
            className="w-full"
          >
            {inList ? (
              <>
                <Check className="w-4 h-4" />
                On Your Hunting List — Tap to Remove
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add to My Hunting Trip
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex gap-3">
    <span className="mt-0.5 text-paper-ink/70">{icon}</span>
    <div className="flex-1">
      <p className="text-[10px] uppercase tracking-widest text-paper-ink/55 font-bold">{label}</p>
      <p className="text-paper-ink/90">{value}</p>
    </div>
  </div>
);
