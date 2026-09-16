export type NodeType = 'file' | 'folder';

export interface VNode {
  id: string;
  name: string;
  type: NodeType;
  parentId: string | null;
  content?: string;
  size?: number;
  updatedAt: number;
}

export type ThemeName = 'lavender' | 'mint' | 'peach' | 'dusk';

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
  | 'about'
  | 'welcome';

export interface AppDefinition {
  id: AppId;
  name: string;
  icon: string;
  comp: React.ComponentType<{ winId?: string; launchProps?: Record<string, unknown> }>;
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