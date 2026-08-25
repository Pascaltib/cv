import { CVHeader } from './components/CVHeader';
import { SummarySection } from './components/SummarySection';
import { ExperienceSection } from './components/ExperienceSection';
import FluidCursor from './components/FluidCursor';
import {
  Shader,
  Ascii,
  SolidColor,
  Tritone,
  WebcamTexture,
} from 'shaders/react'
import { ScrollProgress } from './ScrollProgress';
import { MusicPlaybackProvider } from './components/ipod/music-playback-context';
import { ClickWheelSoundProvider } from './components/ipod/ClickWheelSoundProvider';
import { IPodClassic } from './components/ipod/IPodClassic';

export default function App() {
  return (
    <MusicPlaybackProvider>
      <ClickWheelSoundProvider>
        <div className="relative min-h-screen w-full bg-black overflow-x-hidden">
          <ScrollProgress />
          <Shader style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
            <SolidColor color="#1f0e45" />
            <Ascii cellSize={24} characters="⌁⌗⌔⌭">
              <WebcamTexture />
              <Tritone
                blendMid={0.23}
                colorA="#004ad4"
                colorB="#ffbf00"
                colorC="#0aa9ff"
                colorSpace="oklch"
                visible={true}
              />
            </Ascii>
          </Shader>
          <FluidCursor />
          <div className="relative z-10 pointer-events-auto">
            <CVHeader />
            <SummarySection />
            <ExperienceSection />
          </div>
          <IPodClassic />
        </div>
      </ClickWheelSoundProvider>
    </MusicPlaybackProvider>
  );
}