import { CVHeader } from './components/CVHeader';
import { SummarySection } from './components/SummarySection';
import { ExperienceSection } from './components/ExperienceSection';
import FluidCursor from './components/FluidCursor';
import {
  Shader,
  Blob,
  DotGrid,
  FilmGrain,
  GridDistortion,
  LinearGradient
} from 'shaders/react'

export default function App() {
  return (
    <div className="min-h-screen bg-background relative">
      <Shader style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <LinearGradient
          end={{ "x": 0.8535883654758141, "y": 0.19244874731265896 }}
          angle={0}
          edges="mirror"
          start={{ "x": 0.14135314574770788, "y": 0.8417384461899476 }}
          colorA="#000005"
          colorB="#5e5eed"
          visible={true}
          maskType="alpha"
          transform={{ "edges": "transparent", "scale": 1, "anchorX": 0.5, "anchorY": 0.5, "offsetX": 0, "offsetY": 0, "rotation": 0 }}
          colorSpace="oklch" />
        <Blob
          seed={37}
          size={0.51}
          speed={0.5}
          center={{ "x": 0.820708188428707, "y": 0.3381342476147653 }}
          colorA="#020221"
          colorB="#5e5eed"
          maskType="alpha"
          softness={0.86}
          transform={{ "edges": "transparent", "scale": 1, "anchorX": 0.5, "anchorY": 0.5, "offsetX": 0, "offsetY": 0, "rotation": 0 }}
          colorSpace="linear"
          highlightX={0.3}
          highlightY={-0.3}
          highlightZ={0.4}
          deformation={0.5}
          highlightColor="#ffe11a"
          highlightIntensity={0.56} />
        <Blob
          colorA="#5e5eed"
          colorB="#5e5eed"
          size={0.14}
          deformation={1}
          softness={1}
          highlightIntensity={0}
          highlightX={0.3}
          highlightY={-0.3}
          highlightZ={0.4}
          highlightColor="#ffe11a"
          speed={0.4}
          seed={100}
          center={{ "x": 0.23038254821372114, "y": 0.6969522390995827 }}
          colorSpace="oklch"
          blendMode="normal-oklch"
          maskType="alpha"
          opacity={0.55}
          visible={true}
          transform={{ "offsetX": 0, "offsetY": 0, "rotation": 0, "scale": 1, "anchorX": 0.5, "anchorY": 0.5, "edges": "transparent" }} />
        <DotGrid
          color="#ffffff"
          density={30}
          dotSize={0.04}
          opacity={0.57}
          twinkle={1}
          maskType="alpha"
          blendMode="linearDodge"
          transform={{ "edges": "transparent", "scale": 1, "anchorX": 0.5, "anchorY": 0.5, "offsetX": 0, "offsetY": 0, "rotation": 0 }} />
        <FilmGrain
          maskType="alpha"
          strength={0.09}
          transform={{ "edges": "transparent", "scale": 1, "anchorX": 0.5, "anchorY": 0.5, "offsetX": 0, "offsetY": 0, "rotation": 0 }} />
        <GridDistortion
          decay={3}
          edges="stretch"
          swirl={0}
          radius={1}
          gridSize={20}
          intensity={1} />
      </Shader>
      <FluidCursor />
      <div className="relative z-10 pointer-events-auto">
        <CVHeader />
        <SummarySection />
        <ExperienceSection />
        {/* <SkillsSection /> */}
        {/* <Footer /> */}
      </div>
    </div>
  );
}