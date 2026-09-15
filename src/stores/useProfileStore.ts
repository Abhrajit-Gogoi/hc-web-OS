import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '../types';

interface ProfileStore extends UserProfile {
  updateProfile: (data: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const defProfile: UserProfile = {
  name: 'Developer',
  tagline: 'WebOS Architect',
  bio: 'Building browser desktop experiences.',
  skills: ['TypeScript', 'React', 'Zustand', 'Vite'],
  socials: { github: 'https://github.com' },
  email: 'dev@example.com',
};

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      ...defProfile,
      updateProfile: (data) => set((s) => ({ ...s, ...data })),
      resetProfile: () => set(defProfile),
    }),
    { name: 'webos-profile' }
  )
);