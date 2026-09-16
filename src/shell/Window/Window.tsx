import { useState, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import { WindowState } from '../../types';
import { useWindowStore } from '../../stores/useWindowStore';
import { appIcons, getApp } from '../../apps/registry';

interface WinProps {
  win: WindowState;
}

type Dir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export function Window({ win }: WinProps) {
  const { focusWin, closeWin, minWin, toggleMaxWin, moveWin, setBounds } = useWindowStore();
  const focusedId = useWindowStore((s) => s.focusedId);
  const isFocused = focusedId === win.id;

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<Dir | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0, winX: 0, winY: 0 });

  const appDef = getApp(win.appId);
  const IconComp = appIcons[win.icon] || Square;
  const AppComp = appDef?.comp;

  const minW = appDef?.minW || 240;
  const minH = appDef?.minH || 180;

  const handleMouseDown = () => {
    if (!isFocused) focusWin(win.id);
  };

  const handleTitleMouseDown = (e: ReactMouseEvent) => {
    if (win.isMax) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - win.x, y: e.clientY - win.y });
  };

  const handleResizeMouseDown = (dir: Dir, e: ReactMouseEvent) => {
    e.stopPropagation();
    if (win.isMax) return;
    setResizing(dir);
    setResizeStart({ x: e.clientX, y: e.clientY, w: win.w, h: win.h, winX: win.x, winY: win.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const nx = Math.max(-win.w + 120, Math.min(e.clientX - dragStart.x, window.innerWidth - 120));
        const ny = Math.max(0, Math.min(e.clientY - dragStart.y, window.innerHeight - 80));
        moveWin(win.id, nx, ny);
      } else if (resizing) {
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;
        let nw = resizeStart.w;
        let nh = resizeStart.h;
        let nx = resizeStart.winX;
        let ny = resizeStart.winY;

        if (resizing.includes('e')) nw = Math.max(minW, resizeStart.w + dx);
        if (resizing.includes('s')) nh = Math.max(minH, resizeStart.h + dy);
        if (resizing.includes('w')) {
          const possibleW = resizeStart.w - dx;
          if (possibleW >= minW) {
            nw = possibleW;
            nx = resizeStart.winX + dx;
          }
        }
        if (resizing.includes('n')) {
          const possibleH = resizeStart.h - dy;
          if (possibleH >= minH) {
            nh = possibleH;
            ny = resizeStart.winY + dy;
          }
        }

        setBounds(win.id, { x: nx, y: ny, w: nw, h: nh });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setResizing(null);
    };

    if (isDragging || resizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, resizing, dragStart, resizeStart, win, minW, minH, moveWin, setBounds]);

  if (win.isMin) return null;

  const handles: { dir: Dir; style: React.CSSProperties }[] = [
    { dir: 'n', style: { top: -4, left: 8, right: 8, height: 8, cursor: 'ns-resize' } },
    { dir: 's', style: { bottom: -4, left: 8, right: 8, height: 8, cursor: 'ns-resize' } },
    { dir: 'e', style: { right: -4, top: 8, bottom: 8, width: 8, cursor: 'ew-resize' } },
    { dir: 'w', style: { left: -4, top: 8, bottom: 8, width: 8, cursor: 'ew-resize' } },
    { dir: 'ne', style: { top: -4, right: -4, width: 12, height: 12, cursor: 'ne-resize' } },
    { dir: 'nw', style: { top: -4, left: -4, width: 12, height: 12, cursor: 'nw-resize' } },
    { dir: 'se', style: { bottom: -4, right: -4, width: 12, height: 12, cursor: 'se-resize' } },
    { dir: 'sw', style: { bottom: -4, left: -4, width: 12, height: 12, cursor: 'sw-resize' } },
  ];

  return (
    <div
      onMouseDown={handleMouseDown}
      className="neu-flat"
      style={{
        position: 'absolute',
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.zIndex,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: win.isMax ? 0 : 'var(--radius-win)',
        overflow: 'hidden',
        outline: isFocused ? '1px solid var(--accent)' : 'none',
      }}
    >
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={() => toggleMaxWin(win.id)}
        style={{
          height: 36,
          padding: '0 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface-soft)',
          cursor: win.isMax ? 'default' : 'move',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500 }}>
          <IconComp size={16} color="var(--accent)" />
          <span>{win.title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }} onMouseDown={(e) => e.stopPropagation()}>
          <button onClick={() => minWin(win.id)} className="neu-btn" style={{ width: 22, height: 22, borderRadius: 6 }}>
            <Minus size={12} />
          </button>
          <button onClick={() => toggleMaxWin(win.id)} className="neu-btn" style={{ width: 22, height: 22, borderRadius: 6 }}>
            {win.isMax ? <Copy size={11} /> : <Square size={11} />}
          </button>
          <button onClick={() => closeWin(win.id)} className="neu-btn" style={{ width: 22, height: 22, borderRadius: 6 }}>
            <X size={12} color="#e57373" />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg-surface)', position: 'relative' }}>
        {AppComp ? <AppComp winId={win.id} launchProps={win.launchProps} /> : null}
      </div>

      {!win.isMax &&
        handles.map((h) => (
          <div
            key={h.dir}
            onMouseDown={(e) => handleResizeMouseDown(h.dir, e)}
            style={{ position: 'absolute', zIndex: 10, ...h.style }}
          />
        ))}
    </div>
  );
}