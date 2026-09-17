import { useEffect, useState, useRef } from 'react';
import { Menu, Lock } from 'lucide-react';
import { useSystemStore } from '../../stores/useSystemStore';
import { useWindowStore } from '../../stores/useWindowStore';
import { Window } from '../Window/Window';
import { Taskbar } from '../Taskbar/Taskbar';
import { getApp } from '../../apps/registry';
import debg from '../../assets/bg.jpg';

export function Desktop() {
  const { theme, wallpaper, setLocked } = useSystemStore();
  const { wins, openWin } = useWindowStore();
  const [now, setNow] = useState(new Date());
  const welcomed = useRef(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [theme]);

  useEffect(() => {
    if (!welcomed.current) {
      welcomed.current = true;
      const w = getApp('welcome');
      if (w) {
        openWin({ appId: w.id, title: w.name, icon: w.icon, w: w.defW, h: w.defH });
      }
    }
  }, [openWin]);

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const activeWallpaper = (!wallpaper || wallpaper === '/bg.jpg') ? debg : wallpaper;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${activeWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <header
        style={{
          height: 40,
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(216, 205, 237, 0.25)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
        }}
      >
        <button className="neu-btn" style={{ width: 32, height: 32, borderRadius: 8 }}>
          <Menu size={18} color="var(--txt-main)" />
        </button>

        <div
          style={{
            fontSize: 16,
            letterSpacing: 4,
            fontWeight: 300,
            color: 'rgba(255, 255, 255, 0.85)',
            textShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        >
          SERENEOS
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.9)' }}>
            {timeStr}
          </span>
          <button
            onClick={() => setLocked(true)}
            className="neu-btn"
            style={{ width: 30, height: 30, borderRadius: 8 }}
          >
            <Lock size={14} color="var(--txt-main)" />
          </button>
        </div>
      </header>

      <main style={{ flex: 1, position: 'relative' }}>
        {wins.map((win) => (
          <Window key={win.id} win={win} />
        ))}
      </main>

      <Taskbar />
    </div>
  );
}