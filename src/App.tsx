import { CVHeader } from './components/CVHeader';
import { SummarySection } from './components/SummarySection';
import { ExperienceSection } from './components/ExperienceSection';
import FluidCursor from './components/FluidCursor';
import { AsciiWebcamBackground, StaticBackground } from './components/AsciiWebcamBackground';
import { useLiteMode } from './hooks/use-media-query';
import { useHashRoute } from './hooks/use-hash-route';
import { SplitFlapBoard } from './components/globe/SplitFlapBoard';
import { lazy, Suspense } from 'react';

// Three.js only loads when someone opens the globe.
const GlobePage = lazy(() => import('./components/globe/GlobePage'));
import { ScrollProgress } from './ScrollProgress';
import { MusicPlaybackProvider } from './components/ipod/music-playback-context';
import { ClickWheelSoundProvider } from './components/ipod/ClickWheelSoundProvider';
import { IPodClassic } from './components/ipod/IPodClassic';

export default function App() {
  const lite = useLiteMode();
  const { route, navigate, back } = useHashRoute();

  return (
    <MusicPlaybackProvider>
      <ClickWheelSoundProvider>
        <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
          <ScrollProgress />
          {lite ? <StaticBackground /> : <AsciiWebcamBackground />}
          {!lite && <FluidCursor />}
          <div className="relative z-10 pointer-events-auto">
            <CVHeader />
            <SummarySection />
            <SplitFlapBoard onBoard={() => navigate('/globe')} />
            <ExperienceSection />
          </div>
          {!lite && <IPodClassic />}
          {route === '/globe' && (
            <Suspense fallback={null}>
              <GlobePage onClose={back} />
            </Suspense>
          )}
        </div>
      </ClickWheelSoundProvider>
    </MusicPlaybackProvider>
  );
}