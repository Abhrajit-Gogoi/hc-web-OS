import { ComponentType } from 'react';

export type AppId =
  | 'calc'
  | 'clock'
  | 'files'
  | 'browser'
  | 'paint'
  | 'settings'
  | 'taskmgr'
  | 'term'
  | 'editor'
  | 'about';

export type NodeType = 'dir' | 'file' | 'app';
export type ThemeName = 'lavender' | 'dark' | 'light';

export interface FsNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string;
  content?: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: string;
  comp: ComponentType<{ winId: string; launchProps?: Record<string, unknown> }>;
  defW: number;
  defH: number;
  minW?: number;
  minH?: number;
  single?: boolean;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon: string;
  x: number;
  y: number;
  w: number;
  h: number;
  zIndex: number;
  isMin: boolean;
  isMax: boolean;
  prevBounds?: { x: number; y: number; w: number; h: number };
  launchProps?: Record<string, unknown>;
}

export interface SystemSettings {
  theme: ThemeName;
  wallpaper: string;
  accent: string;
  sound: boolean;
  user: string;
  booted: boolean;
  locked: boolean;
  pinned: AppId[];
}

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  danger?: boolean;
  sep?: boolean;
}

export interface UserProfile {
  name: string;
  tagline: string;
  bio: string;
  skills: string[];
  socials: Record<string, string>;
  email: string;
}