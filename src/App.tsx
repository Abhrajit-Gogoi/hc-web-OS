import { useSystemStore } from './stores/useSystemStore';
import { BootScreen } from './shell/BootScreen/BootScreen';
import { LockScreen } from './shell/LockScreen/LockScreen';
import { Desktop } from './shell/Desktop/Desktop';

export default function App() {
  const { booted, locked, setBooted, setLocked } = useSystemStore();

  if (!booted) {
    return <BootScreen onDone={() => setBooted(true)} />;
  }

  if (locked) {
    return <LockScreen onUnlock={() => setLocked(false)} />;
  }

  return <Desktop />;
}