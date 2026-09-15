import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FsNode, NodeType } from '../types';

interface FileSystemStore {
  nodes: Record<string, FsNode>;
  rootId: string;
  getChildren: (parentId: string) => FsNode[];
  getNode: (id: string) => FsNode | undefined;
  createNode: (opts: { name: string; type: NodeType; parentId: string; content?: string }) => FsNode;
  renameNode: (id: string, name: string) => void;
  deleteNode: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  getPath: (id: string) => string;
  resetFs: () => void;
}

const ROOT_ID = 'root-dir';

const initNodes = (): Record<string, FsNode> => ({
  [ROOT_ID]: { id: ROOT_ID, name: 'Root', type: 'dir', parentId: '', createdAt: Date.now(), updatedAt: Date.now() },
  'desktop-dir': { id: 'desktop-dir', name: 'Desktop', type: 'dir', parentId: ROOT_ID, createdAt: Date.now(), updatedAt: Date.now() },
  'docs-dir': { id: 'docs-dir', name: 'Documents', type: 'dir', parentId: ROOT_ID, createdAt: Date.now(), updatedAt: Date.now() },
  'pics-dir': { id: 'pics-dir', name: 'Pictures', type: 'dir', parentId: ROOT_ID, createdAt: Date.now(), updatedAt: Date.now() },
});

export const useFileSystemStore = create<FileSystemStore>()(
  persist(
    (set, get) => ({
      nodes: initNodes(),
      rootId: ROOT_ID,

      getChildren: (parentId) => {
        const nodes = get().nodes;
        return Object.values(nodes)
          .filter((n) => n.parentId === parentId)
          .sort((a, b) => {
            if (a.type === 'dir' && b.type !== 'dir') return -1;
            if (a.type !== 'dir' && b.type === 'dir') return 1;
            return a.name.localeCompare(b.name);
          });
      },

      getNode: (id) => get().nodes[id],

      createNode: (opts) => {
        const id = crypto.randomUUID();
        const node: FsNode = {
          id,
          name: opts.name,
          type: opts.type,
          parentId: opts.parentId,
          content: opts.content || '',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ nodes: { ...s.nodes, [id]: node } }));
        return node;
      },

      renameNode: (id, name) => {
        set((s) => {
          const node = s.nodes[id];
          if (!node) return s;
          return {
            nodes: { ...s.nodes, [id]: { ...node, name, updatedAt: Date.now() } },
          };
        });
      },

      deleteNode: (id) => {
        set((s) => {
          const newNodes = { ...s.nodes };
          const rm = (targetId: string) => {
            delete newNodes[targetId];
            Object.values(s.nodes)
              .filter((n) => n.parentId === targetId)
              .forEach((child) => rm(child.id));
          };
          rm(id);
          return { nodes: newNodes };
        });
      },

      updateContent: (id, content) => {
        set((s) => {
          const node = s.nodes[id];
          if (!node) return s;
          return {
            nodes: { ...s.nodes, [id]: { ...node, content, updatedAt: Date.now() } },
          };
        });
      },

      getPath: (id) => {
        const { nodes } = get();
        const parts: string[] = [];
        let curr = nodes[id];
        while (curr && curr.id !== ROOT_ID) {
          parts.unshift(curr.name);
          curr = nodes[curr.parentId];
        }
        return '/' + parts.join('/');
      },

      resetFs: () => set({ nodes: initNodes() }),
    }),
    { name: 'webos-fs', version: 3 }
  )
);