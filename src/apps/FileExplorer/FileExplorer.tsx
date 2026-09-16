import { useState } from 'react';
import { Folder, FileText, ArrowLeft, Plus, Trash2, FolderPlus } from 'lucide-react';
import { useFSStore } from '../../stores/useFSStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { VNode } from '../../types';

interface FileExplorerProps {
  winId?: string;
  launchProps?: Record<string, unknown>;
}

export function FileExplorer({ launchProps }: FileExplorerProps) {
  const initialFolder = (launchProps?.folderId as string) || 'root';
  const [currId, setCurrId] = useState<string>(initialFolder);
  const [selId, setSelId] = useState<string | null>(null);

  const { nodes, mkDir, mkFile, delNode } = useFSStore();
  const openWin = useWindowStore((s) => s.openWin);

  const currNode = nodes[currId] || nodes.root;
  const children = Object.values(nodes).filter((n) => n.parentId === currId);

  const handleOpen = (node: VNode) => {
    if (node.type === 'folder') {
      setCurrId(node.id);
      setSelId(null);
    } else if (node.type === 'file') {
      openWin({
        appId: 'editor',
        title: node.name,
        icon: 'FileText',
        w: 600,
        h: 450,
        props: { fileId: node.id },
      });
    }
  };

  const handleBack = () => {
    if (currNode.parentId) {
      setCurrId(currNode.parentId);
      setSelId(null);
    }
  };

  const handleNewFolder = () => {
    const name = prompt('Folder name:', 'New Folder');
    if (name) mkDir(name, currId);
  };

  const handleNewFile = () => {
    const name = prompt('File name:', 'document.txt');
    if (name) mkFile(name, currId, '');
  };

  const handleDelete = () => {
    if (selId) {
      delNode(selId);
      setSelId(null);
    }
  };

  const quickLinks = [
    { id: 'desktop', name: 'Desktop' },
    { id: 'docs', name: 'Documents' },
    { id: 'downloads', name: 'Downloads' },
    { id: 'pics', name: 'Pictures' },
  ];

  return (
    <div style={{ display: 'flex', height: '100%', background: 'var(--bg-surface)' }}>
      <div
        style={{
          width: 150,
          borderRight: '1px solid rgba(0,0,0,0.06)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-muted)', marginBottom: 6 }}>
          FAVORITES
        </div>
        {quickLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => {
              setCurrId(link.id);
              setSelId(null);
            }}
            className={currId === link.id ? 'neu-pressed' : 'neu-btn'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 12,
              justifyContent: 'flex-start',
            }}
          >
            <Folder size={14} color="var(--accent)" />
            <span>{link.name}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            height: 40,
            padding: '0 12px',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handleBack}
              disabled={!currNode.parentId}
              className="neu-btn"
              style={{ width: 26, height: 26, borderRadius: 6, opacity: currNode.parentId ? 1 : 0.4 }}
            >
              <ArrowLeft size={14} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt-main)' }}>
              {currNode.name}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={handleNewFolder} className="neu-btn" style={{ width: 28, height: 28, borderRadius: 6 }} title="New Folder">
              <FolderPlus size={14} />
            </button>
            <button onClick={handleNewFile} className="neu-btn" style={{ width: 28, height: 28, borderRadius: 6 }} title="New File">
              <Plus size={14} />
            </button>
            {selId && (
              <button onClick={handleDelete} className="neu-btn" style={{ width: 28, height: 28, borderRadius: 6 }} title="Delete">
                <Trash2 size={14} color="#e57373" />
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: 1, padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 12, alignContent: 'start' }}>
          {children.map((child) => {
            const isSel = selId === child.id;
            const Icon = child.type === 'folder' ? Folder : FileText;
            return (
              <div
                key={child.id}
                onClick={() => setSelId(child.id)}
                onDoubleClick={() => handleOpen(child)}
                className={isSel ? 'neu-pressed' : ''}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 10,
                  borderRadius: 10,
                  cursor: 'pointer',
                  userSelect: 'none',
                  background: isSel ? undefined : 'transparent',
                }}
              >
                <Icon size={32} color={child.type === 'folder' ? 'var(--accent)' : 'var(--txt-muted)'} />
                <span
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                    textAlign: 'center',
                    wordBreak: 'break-word',
                    color: 'var(--txt-main)',
                  }}
                >
                  {child.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}