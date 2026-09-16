import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VNode } from '../types';

interface FSStore {
  nodes: Record<string, VNode>;
  mkDir: (name: string, parentId: string) => string;
  mkFile: (name: string, parentId: string, content?: string) => string;
  delNode: (id: string) => void;
  renameNode: (id: string, name: string) => void;
  writeFile: (id: string, content: string) => void;
}

const initNodes: Record<string, VNode> = {
  root: { id: 'root', name: 'Root', type: 'folder', parentId: null, updatedAt: Date.now() },
  desktop: { id: 'desktop', name: 'Desktop', type: 'folder', parentId: 'root', updatedAt: Date.now() },
  docs: { id: 'docs', name: 'Documents', type: 'folder', parentId: 'root', updatedAt: Date.now() },
  downloads: { id: 'downloads', name: 'Downloads', type: 'folder', parentId: 'root', updatedAt: Date.now() },
  pics: { id: 'pics', name: 'Pictures', type: 'folder', parentId: 'root', updatedAt: Date.now() },
  welcome: {
    id: 'welcome_txt',
    name: 'welcome.txt',
    type: 'file',
    parentId: 'desktop',
    content: 'Welcome to SereneOS file system!',
    size: 34,
    updatedAt: Date.now(),
  },
};

export const useFSStore = create<FSStore>()(
  persist(
    (set) => ({
      nodes: initNodes,

      mkDir: (name, parentId) => {
        const id = crypto.randomUUID();
        const node: VNode = { id, name, type: 'folder', parentId, updatedAt: Date.now() };
        set((s) => ({ nodes: { ...s.nodes, [id]: node } }));
        return id;
      },

      mkFile: (name, parentId, content = '') => {
        const id = crypto.randomUUID();
        const node: VNode = {
          id,
          name,
          type: 'file',
          parentId,
          content,
          size: content.length,
          updatedAt: Date.now(),
        };
        set((s) => ({ nodes: { ...s.nodes, [id]: node } }));
        return id;
      },

      delNode: (id) => {
        set((s) => {
          const copy = { ...s.nodes };
          const del = (targetId: string) => {
            delete copy[targetId];
            Object.values(copy)
              .filter((n) => n.parentId === targetId)
              .forEach((n) => del(n.id));
          };
          del(id);
          return { nodes: copy };
        });
      },

      renameNode: (id, name) => {
        set((s) => {
          const node = s.nodes[id];
          if (!node) return s;
          return { nodes: { ...s.nodes, [id]: { ...node, name, updatedAt: Date.now() } } };
        });
      },

      writeFile: (id, content) => {
        set((s) => {
          const node = s.nodes[id];
          if (!node) return s;
          return {
            nodes: {
              ...s.nodes,
              [id]: { ...node, content, size: content.length, updatedAt: Date.now() },
            },
          };
        });
      },
    }),
    { name: 'webos-fs' }
  )
);