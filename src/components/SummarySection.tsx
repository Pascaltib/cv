import { Brain, Code, Lightbulb, ChevronDown } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { Sparkles } from './Sparkles';

export function SummarySection() {
  const scrollToNextSection = () => {
    const summaryHeight = window.innerHeight * 2;
    window.scrollTo({
      top: summaryHeight,
      behavior: 'smooth'
    });
  };
  return (
    <div className="pb-16 px-8 md:px-16 relative mt-12 h-dvh flex flex-col justify-between gap-12">
      <div className="max-w-4xl mx-auto relative z-10 grow flex flex-col justify-center">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-white">
            Summary
          </h2>
          <div className="w-16 h-1 bg-white mx-auto rounded-full"></div>
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
          draggable={true}
          blurIntensity="sm"
          shadowIntensity="md"
          glowIntensity="sm"
          borderRadius="12px"
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
      <div className='relative h-56 w-full overflow-hidden flex flex-col items-center'>
        <div className='absolute inset-x-0 top-0 flex justify-center'>
          <div className='bg-linear-to-r from-transparent via-yellow-200 to-transparent h-[2px] w-1/2 blur-xs' />
        </div>
        <div className='absolute inset-x-0 top-0 flex justify-center'>
          <div className='bg-linear-to-r from-transparent via-yellow-100 to-transparent h-px w-1/2' />
        </div>
        <div className='absolute inset-x-0 top-0 flex justify-center'>
          <div className='bg-linear-to-r from-transparent via-yellow-50 to-transparent h-px w-1/4' />
        </div>

        <Sparkles
          density={1200}
          mousemove={true}
          className='absolute inset-x-0 -mt-24 top-0 h-full w-full mask-[radial-gradient(50%_50%,white,transparent_55%)]'
        />

        {/* Scroll indicator */}
        <button
          onClick={scrollToNextSection}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 group cursor-pointer"
          aria-label="Scroll to next section"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-1.5 group-hover:border-foreground/50 transition-colors">
              <div className="w-1 h-2 bg-foreground/50 rounded-full animate-scroll-down group-hover:bg-foreground/70" />
            </div>
            <ChevronDown className="w-5 h-5 text-foreground/30 group-hover:text-foreground/50 transition-all animate-bounce-subtle" />
          </div>
        </button>
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
      draggable={true}
      blurIntensity="sm"
      shadowIntensity="md"
      glowIntensity="sm"
      borderRadius="12px"
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
