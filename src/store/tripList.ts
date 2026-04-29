import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Animal } from "@/data/animals";

interface TripState {
  list: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  has: (id: number) => boolean;
  clear: () => void;
}

export const useTripList = create<TripState>()(
  persist(
    (set, get) => ({
      list: [],
      add: (id) => set((s) => (s.list.includes(id) ? s : { list: [...s.list, id] })),
      remove: (id) => set((s) => ({ list: s.list.filter((x) => x !== id) })),
      toggle: (id) =>
        set((s) =>
          s.list.includes(id)
            ? { list: s.list.filter((x) => x !== id) }
            : { list: [...s.list, id] },
        ),
      has: (id) => get().list.includes(id),
      clear: () => set({ list: [] }),
    }),
    { name: "zha-trip-list" },
  ),
);

export type { Animal };
