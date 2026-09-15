import { create } from 'zustand';
import { WindowState, AppId } from '../types';

interface WindowStore {
  wins: WindowState[];
  focusedId: string | null;
  topZ: number;
  openWin: (opts: { appId: AppId; title: string; icon: string; w?: number; h?: number; props?: Record<string, unknown> }) => string;
  closeWin: (id: string) => void;
  focusWin: (id: string) => void;
  minWin: (id: string) => void;
  toggleMaxWin: (id: string) => void;
  moveWin: (id: string, x: number, y: number) => void;
  resizeWin: (id: string, w: number, h: number) => void;
  setBounds: (id: string, bounds: { x: number; y: number; w: number; h: number }) => void;
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  wins: [],
  focusedId: null,
  topZ: 100,

  openWin: (opts) => {
    const { wins, topZ } = get();
    const id = crypto.randomUUID();
    const z = topZ + 1;
    const idx = wins.length % 6;
    const newWin: WindowState = {
      id,
      appId: opts.appId,
      title: opts.title,
      icon: opts.icon,
      x: 80 + idx * 30,
      y: 60 + idx * 30,
      w: opts.w || 600,
      h: opts.h || 400,
      zIndex: z,
      isMin: false,
      isMax: false,
      launchProps: opts.props,
    };
    set({ wins: [...wins, newWin], focusedId: id, topZ: z });
    return id;
  },

  closeWin: (id) => {
    const wins = get().wins.filter((w) => w.id !== id);
    const focusedId = get().focusedId === id ? (wins[wins.length - 1]?.id || null) : get().focusedId;
    set({ wins, focusedId });
  },

  focusWin: (id) => {
    const { wins, topZ, focusedId } = get();
    if (focusedId === id) {
      const target = wins.find((w) => w.id === id);
      if (target?.isMin) {
        set({
          wins: wins.map((w) => (w.id === id ? { ...w, isMin: false } : w)),
        });
      }
      return;
    }
    const z = topZ + 1;
    set({
      topZ: z,
      focusedId: id,
      wins: wins.map((w) => (w.id === id ? { ...w, zIndex: z, isMin: false } : w)),
    });
  },

  minWin: (id) => {
    const wins = get().wins.map((w) => (w.id === id ? { ...w, isMin: true } : w));
    const activeWins = wins.filter((w) => !w.isMin);
    const focusedId = activeWins[activeWins.length - 1]?.id || null;
    set({ wins, focusedId });
  },

  toggleMaxWin: (id) => {
    set((s) => ({
      wins: s.wins.map((w) => {
        if (w.id !== id) return w;
        if (w.isMax) {
          const b = w.prevBounds || { x: 80, y: 60, w: 600, h: 400 };
          return { ...w, isMax: false, ...b };
        }
        return {
          ...w,
          isMax: true,
          prevBounds: { x: w.x, y: w.y, w: w.w, h: w.h },
          x: 0,
          y: 0,
          w: window.innerWidth,
          h: window.innerHeight - 40,
        };
      }),
    }));
  },

  moveWin: (id, x, y) => {
    set((s) => ({
      wins: s.wins.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  },

  resizeWin: (id, w, h) => {
    set((s) => ({
      wins: s.wins.map((win) => (win.id === id ? { ...win, w, h } : win)),
    }));
  },

  setBounds: (id, b) => {
    set((s) => ({
      wins: s.wins.map((w) => (w.id === id ? { ...w, ...b } : w)),
    }));
  },
}));