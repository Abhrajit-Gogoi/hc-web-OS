import { useWindowStore } from '../../stores/useWindowStore';
import { useSystemStore } from '../../stores/useSystemStore';
import { appIcons, getApp } from '../../apps/registry';
import { AppId } from '../../types';

export function Taskbar() {
  const { wins, focusedId, focusWin, minWin, openWin } = useWindowStore();
  const { pinned } = useSystemStore();

  const handleAppClick = (appId: AppId) => {
    const activeWin = wins.find((w) => w.appId === appId);
    if (activeWin) {
      if (focusedId === activeWin.id && !activeWin.isMin) {
        minWin(activeWin.id);
      } else {
        focusWin(activeWin.id);
      }
    } else {
      const def = getApp(appId);
      if (def) {
        openWin({ appId: def.id, title: def.name, icon: def.icon, w: def.defW, h: def.defH });
      }
    }
  };

  const handleWinClick = (winId: string) => {
    const target = wins.find((w) => w.id === winId);
    if (!target) return;
    if (focusedId === winId && !target.isMin) {
      minWin(winId);
    } else {
      focusWin(winId);
    }
  };

  return (
    <footer
      style={{
        height: 48,
        padding: '0 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: 'rgba(216, 205, 237, 0.35)',
        backdropFilter: 'blur(10px)',
        zIndex: 99999,
        borderTop: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {pinned.map((id) => {
        const def = getApp(id);
        if (!def) return null;
        const Icon = appIcons[def.icon];
        const activeWin = wins.find((w) => w.appId === id);
        const isActive = activeWin && focusedId === activeWin.id && !activeWin.isMin;

        return (
          <button
            key={id}
            onClick={() => handleAppClick(id)}
            className={isActive ? 'neu-pressed' : 'neu-btn'}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
            title={def.name}
          >
            {Icon && <Icon size={18} color="var(--txt-main)" />}
            {activeWin && (
              <span
                style={{
                  position: 'absolute',
                  bottom: 3,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }}
              />
            )}
          </button>
        );
      })}

      <div style={{ width: 1, height: 24, background: 'rgba(0,0,0,0.1)', margin: '0 4px' }} />

      {wins
        .filter((w) => !pinned.includes(w.appId))
        .map((w) => {
          const Icon = appIcons[w.icon];
          const isActive = focusedId === w.id && !w.isMin;

          return (
            <button
              key={w.id}
              onClick={() => handleWinClick(w.id)}
              className={isActive ? 'neu-pressed' : 'neu-btn'}
              style={{
                height: 36,
                padding: '0 10px',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
              }}
            >
              {Icon && <Icon size={16} color="var(--accent)" />}
              <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {w.title}
              </span>
            </button>
          );
        })}
    </footer>
  );
}