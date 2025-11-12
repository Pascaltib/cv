import { Brain, Code, Lightbulb } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';

export function SummarySection() {
  return (
    <div className="pb-16 px-8 md:px-16 relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Professional Summary
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <HighlightCard
            icon={<Brain className="w-6 h-6" />}
            title="AI Expertise"
            description="Deep experience with LLMs, AI integration, and cutting-edge technologies"
          />
          <HighlightCard
            icon={<Code className="w-6 h-6" />}
            title="Full Stack Development"
            description="Comprehensive web development skills across modern frameworks and technologies"
          />
          <HighlightCard
            icon={<Lightbulb className="w-6 h-6" />}
            title="Innovation Leader"
            description="CTO experience driving product development and technical strategy"
          />
        </div>

        <LiquidGlassCard
          glowIntensity="md"
          shadowIntensity="md"
          borderRadius="16px"
          blurIntensity="md"
          draggable={true}
          className="p-8"
        >
          <div className="relative z-30">
            <p className="text-white leading-relaxed text-lg">
              Currently working as <strong>Lead Developer at Navar and Founding engineer/Product manager for KnowThyself360°</strong>.

            </p>
            <p className="text-white leading-relaxed text-lg mt-4">
              My educational and career path started in Business and Economics, but I soon discovered that my passion and skill was in computer programming.
              What I love most about programming is the ability to create a product from scratch using my own hands (or fingers).
            </p>
            <p className="text-white/80 mt-6 italic">
              🌍 I grew up and lived in Colombia, USA, India, The Netherlands, and Austria. I am currently living in Spain.
            </p>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
}

function HighlightCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <LiquidGlassCard
      glowIntensity="sm"
      shadowIntensity="sm"
      borderRadius="12px"
      blurIntensity="sm"
      draggable={true}
      className="group p-6"
    >
      <div className="relative z-30">
        <div className="mb-4 p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg w-fit text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="mb-2 text-white">{title}</h3>
        <p className="text-white/80">{description}</p>
      </div>
    </LiquidGlassCard>
  );
}
