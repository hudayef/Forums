import { create } from "zustand";

interface ForumState {
  activeCategoryId: string | null;
  searchQuery: string;
  setActiveCategory: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const useForumStore = create<ForumState>((set) => ({
  activeCategoryId: null,
  searchQuery: "",
  setActiveCategory: (id) => set({ activeCategoryId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
