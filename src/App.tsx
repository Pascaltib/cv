import { CVHeader } from './components/CVHeader';
import { SummarySection } from './components/SummarySection';
import { ExperienceSection } from './components/ExperienceSection';
import FluidCursor from './components/FluidCursor';

export default function App() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Fixed animated background for glass effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-primary to-secondary rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-0 w-80 h-80 bg-linear-to-br from-primary to-secondary rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-linear-to-br from-primary to-secondary rounded-full blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-linear-to-br from-primary to-secondary rounded-full blur-3xl animate-blob animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-linear-to-br from-primary to-secondary rounded-full blur-3xl animate-blob animation-delay-3000"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-linear-to-br from-primary to-secondary rounded-full blur-3xl animate-blob animation-delay-1000"></div>
        </div>
      </div>

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