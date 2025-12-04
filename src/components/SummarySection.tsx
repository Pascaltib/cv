import { useState, useEffect } from 'react';
import { Brain, Code, Lightbulb, ChevronDown } from 'lucide-react';
import { LiquidGlassCard } from './LiquidGlassCard';
import { Sparkles } from './Sparkles';

export function SummarySection() {
  const [showScrollButton, setShowScrollButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const summaryHeight = window.innerHeight * 2;
      const scrollPosition = window.scrollY;
      // Hide button when scrolled past the summary section
      setShowScrollButton(scrollPosition < summaryHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const startPosition = window.scrollY;
    const targetPosition = window.innerHeight * 2;
    const distance = targetPosition - startPosition;
    const duration = 1200; // milliseconds
    let startTime: number | null = null;

    // Easing function: ease-in-out-cubic with emphasis on easing at the beginning
    const easeInOutCubic = (t: number): number => {
      return t < 0.5
        ? 4 * t * t * t // Ease in (slower at start)
        : 1 - Math.pow(-2 * t + 2, 3) / 2; // Ease out
    };

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Apply easing
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };
  return (
    <div className="pb-16 px-8 md:px-16 relative mt-12 min-h-dvh md:h-dvh flex flex-col justify-between gap-12">
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
            title="AI & LLMs"
            description="Built agentic workflows with tool calling, RAG pipelines, and multi-model systems in production"
          />
          <HighlightCard
            icon={<Code className="w-6 h-6" />}
            title="Full Stack"
            description="TypeScript, Svelte/SvelteKit, React, Node.js, PostgreSQL, AWS"
          />
          <HighlightCard
            icon={<Lightbulb className="w-6 h-6" />}
            title="Startup Experience"
            description="CTO at Audemic, founding engineer at two other startups. Shipped from 0→1"
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
      draggable={true}
      blurIntensity="sm"
      shadowIntensity="md"
      glowIntensity="sm"
      borderRadius="12px"
      className="group p-6"
    >
      <div className="relative z-30">
        <div className="mb-4 p-3 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg w-fit text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="mb-2 text-white">{title}</h3>
        <p className="text-white/80">{description}</p>
      </div>
    </LiquidGlassCard>
  );
}
