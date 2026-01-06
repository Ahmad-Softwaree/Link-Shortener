import { create } from "zustand";

interface FilterState {
  showFilters: boolean;
  toggleFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  showFilters: localStorage.getItem("showFilters") === "true" || false,

  toggleFilters: () =>
    set((state) => {
      const newValue = !state.showFilters;
      localStorage.setItem("showFilters", newValue.toString());
      return { showFilters: newValue };
    }),
}));
