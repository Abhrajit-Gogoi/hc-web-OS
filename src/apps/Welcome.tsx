import { Info } from 'lucide-react';

export function Welcome() {
  return (
    <div
      style={{
        background: '#fff',
        height: '100%',
        padding: 24,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
      }}
    >
      <div
        className="neu-pressed"
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Info size={32} color="var(--accent)" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 500, color: 'var(--txt-main)' }}>
        Welcome to SereneOS
      </h2>
      <p style={{ fontSize: 14, color: 'var(--txt-muted)', lineHeight: 1.5, maxWidth: 320 }}>
        A desktop experience designed with neumorphic elements and window management.
      </p>
    </div>
  );
}