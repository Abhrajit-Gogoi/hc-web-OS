import { useEffect } from 'react';
import { useSystemStore } from '../../stores/useSystemStore';

export function Desktop() {
  const { theme, wallpaper } = useSystemStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 22,
          letterSpacing: 4,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.7)',
          textShadow: '0 2px 4px rgba(0,0,0,0.15)',
          pointerEvents: 'none',
        }}
      >
        SERENEOS
      </div>
    </div>
  );
}