import { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import { useFSStore } from '../../stores/useFSStore';
import { useWindowStore } from '../../stores/useWindowStore';

interface TextEditorProps {
  winId?: string;
  launchProps?: Record<string, unknown>;
}

export function TextEditor({ winId, launchProps }: TextEditorProps) {
  const fileId = launchProps?.fileId as string | undefined;
  const { nodes, writeFile, mkFile } = useFSStore();
  const setTitle = useWindowStore((s) => s.setTitle);

  const node = fileId ? nodes[fileId] : null;
  const [text, setText] = useState(node?.content || '');
  const [currFileId, setCurrFileId] = useState<string | undefined>(fileId);

  useEffect(() => {
    if (node && winId) {
      setTitle(winId, node.name);
    }
  }, [node, winId, setTitle]);

  const handleSave = () => {
    if (currFileId) {
      writeFile(currFileId, text);
    } else {
      const fn = prompt('Save as:', 'document.txt');
      if (fn) {
        const newId = mkFile(fn, 'docs', text);
        setCurrFileId(newId);
        if (winId) setTitle(winId, fn);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
      <div
        style={{
          height: 36,
          padding: '0 12px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface-soft)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--txt-muted)' }}>
          <FileText size={14} />
          <span>{currFileId ? nodes[currFileId]?.name || 'Document' : 'Untitled'}</span>
        </div>
        <button onClick={handleSave} className="neu-btn" style={{ padding: '4px 10px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <Save size={14} color="var(--accent)" />
          <span>Save</span>
        </button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type here..."
        style={{
          flex: 1,
          width: '100%',
          padding: 16,
          border: 'none',
          outline: 'none',
          resize: 'none',
          fontSize: 14,
          fontFamily: 'monospace',
          color: 'var(--txt-main)',
          background: 'transparent',
        }}
      />
    </div>
  );
}