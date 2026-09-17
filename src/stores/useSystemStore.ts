import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SystemSettings, AppId } from '../types';
import debg from '../assets/bg.jpg';

interface SystemStore extends SystemSettings {
  setTheme: (t: SystemSettings['theme']) => void;
  setWallpaper: (w: string) => void;
  setAccent: (a: string) => void;
  setSound: (s: boolean) => void;
  setUser: (u: string) => void;
  setBooted: (b: boolean) => void;
  setLocked: (l: boolean) => void;
  togglePin: (id: AppId) => void;
}

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      theme: 'lavender',
      wallpaper: debg,
      accent: '#a482be',
      sound: true,
      user: 'User',
      booted: false,
      locked: true,
      pinned: ['files', 'editor', 'term'],

      setTheme: (theme) => set({ theme }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setAccent: (accent) => set({ accent }),
      setSound: (sound) => set({ sound }),
      setUser: (user) => set({ user }),
      setBooted: (booted) => set({ booted }),
      setLocked: (locked) => set({ locked }),
      togglePin: (id) =>
        set((s) => ({
          pinned: s.pinned.includes(id)
            ? s.pinned.filter((p) => p !== id)
            : [...s.pinned, id],
        })),
    }),
    { name: 'webos-system' }
  )
);
