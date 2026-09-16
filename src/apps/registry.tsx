import { ComponentType } from 'react';
import {
  Calculator,
  Clock,
  Folder,
  Globe,
  Palette,
  Settings,
  Activity,
  Terminal,
  FileText,
  User,
  Info,
} from 'lucide-react';
import { AppDefinition, AppId } from '../types';
import { Welcome } from './Welcome';
import { FileExplorer } from './FileExplorer/FileExplorer';
import { TextEditor } from './TextEditor/TextEditor';

const stub = (name: string) => function AppStub() {
  return <div style={{ padding: 16 }}>{name} App Placeholder</div>;
};

export const appRegistry: Record<AppId, AppDefinition> = {
  welcome: { id: 'welcome', name: 'Welcome', icon: 'Info', comp: Welcome, defW: 420, defH: 260, single: true },
  files: { id: 'files', name: 'File Explorer', icon: 'Folder', comp: FileExplorer, defW: 700, defH: 480 },
  editor: { id: 'editor', name: 'Text Editor', icon: 'FileText', comp: TextEditor, defW: 600, defH: 450 },
  calc: { id: 'calc', name: 'Calculator', icon: 'Calculator', comp: stub('Calculator'), defW: 320, defH: 440, single: true },
  clock: { id: 'clock', name: 'Clock', icon: 'Clock', comp: stub('Clock'), defW: 400, defH: 480, single: true },
  browser: { id: 'browser', name: 'Mini Browser', icon: 'Globe', comp: stub('Mini Browser'), defW: 800, defH: 550 },
  paint: { id: 'paint', name: 'Paint', icon: 'Palette', comp: stub('Paint'), defW: 750, defH: 500 },
  settings: { id: 'settings', name: 'Settings', icon: 'Settings', comp: stub('Settings'), defW: 550, defH: 420, single: true },
  taskmgr: { id: 'taskmgr', name: 'Task Manager', icon: 'Activity', comp: stub('Task Manager'), defW: 500, defH: 400, single: true },
  term: { id: 'term', name: 'Terminal', icon: 'Terminal', comp: stub('Terminal'), defW: 650, defH: 400 },
  about: { id: 'about', name: 'About Me', icon: 'User', comp: stub('About Me'), defW: 580, defH: 480, single: true },
};

export const appIcons: Record<string, ComponentType<{ size?: number; color?: string }>> = {
  Calculator,
  Clock,
  Folder,
  Globe,
  Palette,
  Settings,
  Activity,
  Terminal,
  FileText,
  User,
  Info,
};

export const getApp = (id: string): AppDefinition | undefined => appRegistry[id as AppId];