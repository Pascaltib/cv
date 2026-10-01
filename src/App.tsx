import { CVHeader } from './components/CVHeader';
import { SummarySection } from './components/SummarySection';
import { ExperienceSection } from './components/ExperienceSection';
import FluidCursor from './components/FluidCursor';
import { AsciiWebcamBackground, StaticBackground } from './components/AsciiWebcamBackground';
import { useLiteMode } from './hooks/use-media-query';
import { ScrollProgress } from './ScrollProgress';
import { MusicPlaybackProvider } from './components/ipod/music-playback-context';
import { ClickWheelSoundProvider } from './components/ipod/ClickWheelSoundProvider';
import { IPodClassic } from './components/ipod/IPodClassic';

export default function App() {
  const lite = useLiteMode();

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
            <ExperienceSection />
          </div>
          {!lite && <IPodClassic />}
        </div>
      </ClickWheelSoundProvider>
    </MusicPlaybackProvider>
  );
}