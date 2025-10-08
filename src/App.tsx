import { CVHeader } from './components/CVHeader';
import { SummarySection } from './components/SummarySection';
import { ExperienceSection } from './components/ExperienceSection';
import { SkillsSection } from './components/SkillsSection';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <CVHeader />
      <SummarySection />
      <ExperienceSection />
      {/* <SkillsSection /> */}
      {/* <Footer /> */}
    </div>
  );
}