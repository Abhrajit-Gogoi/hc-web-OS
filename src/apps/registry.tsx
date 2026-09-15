import { AppDefinition, AppId } from '../types';

const stub = (name: string) => function AppStub() {
  return <div style={{ padding: 16 }}>{name} App Placeholder</div>;
};

export const appRegistry: Record<AppId, AppDefinition> = {
  calc: { id: 'calc', name: 'Calculator', icon: 'Calculator', comp: stub('Calculator'), defW: 320, defH: 440, single: true },
  clock: { id: 'clock', name: 'Clock', icon: 'Clock', comp: stub('Clock'), defW: 400, defH: 480, single: true },
  files: { id: 'files', name: 'File Explorer', icon: 'Folder', comp: stub('File Explorer'), defW: 700, defH: 480 },
  browser: { id: 'browser', name: 'Mini Browser', icon: 'Globe', comp: stub('Mini Browser'), defW: 800, defH: 550 },
  paint: { id: 'paint', name: 'Paint', icon: 'Palette', comp: stub('Paint'), defW: 750, defH: 500 },
  settings: { id: 'settings', name: 'Settings', icon: 'Settings', comp: stub('Settings'), defW: 550, defH: 420, single: true },
  taskmgr: { id: 'taskmgr', name: 'Task Manager', icon: 'Activity', comp: stub('Task Manager'), defW: 500, defH: 400, single: true },
  term: { id: 'term', name: 'Terminal', icon: 'Terminal', comp: stub('Terminal'), defW: 650, defH: 400 },
  editor: { id: 'editor', name: 'Text Editor', icon: 'FileText', comp: stub('Text Editor'), defW: 600, defH: 450 },
  about: { id: 'about', name: 'About Me', icon: 'User', comp: stub('About Me'), defW: 580, defH: 480, single: true },
};

export const getApp = (id: AppId): AppDefinition | undefined => appRegistry[id];