import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, ChevronDown } from 'lucide-react';
import { EyeTrackingPortrait } from './EyeTrackingPortrait';
import { LiquidGlassCard } from './LiquidGlassCard';
import { Sparkles } from './Sparkles';
import { LineShadowText } from './LineShadowText';
import { HyperText } from './HyperText';

export function CVHeader() {
  const [showScrollButton, setShowScrollButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const headerHeight = window.innerHeight;
      const scrollPosition = window.scrollY;
      // Hide button when scrolled past the header section
      setShowScrollButton(scrollPosition < headerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const startPosition = window.scrollY;
    const targetPosition = window.innerHeight;
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
    <div className="relative overflow-hidden">
      <div className="relative z-10 px-8 md:px-16 flex flex-col gap-12 h-dvh">
        <div className="max-w-5xl mx-auto flex flex-col justify-center items-center grow">
          <div className="">
            <div className="text-center mb-12">


              <h1 className="text-4xl md:text-7xl leading-none font-semibold tracking-tighter text-balance">
                <LineShadowText className="italic" shadowColor={"white"}>
                  Pascal
                </LineShadowText>
                {" "}
                <LineShadowText className="italic" shadowColor={"white"}>
                  Tiberghien
                </LineShadowText>
              </h1>

              {/* <div className="w-24 h-1 bg-linear-to-r from-primary to-secondary mx-auto rounded-full"></div> */}
            </div>

            {/* Eye-tracking portrait */}
            <div className="flex justify-center">
              <EyeTrackingPortrait
                videoSrc="/cv/pascal.mp4"
                size={150}
                maxDistance={500}
                className="transition-transform duration-300 hover:scale-105"
              />
            </div>
            <HyperText className='mt-4'>Full Stack Developer</HyperText>
          </div>

          <div className="flex gap-4 w-fit mt-4">
            <ContactItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              href="mailto:pascaltib@gmail.com"
            />
            {/* <ContactItem
              icon={<Phone className="w-5 h-5" />}
              label="Phone"
              href="tel:+34645587412"
            /> */}
            <ContactItem
              icon={<Linkedin className="w-5 h-5" />}
              label="LinkedIn"
              href="https://linkedin.com/in/pascaltib"
            />
            <ContactItem
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
              href="https://github.com/Pascaltib"
            />
          </div>
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
          {showScrollButton && (
            <button
              onClick={scrollToNextSection}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 group cursor-pointer transition-opacity duration-500"
              aria-label="Scroll to next section"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-1.5 group-hover:border-foreground/50 transition-colors">
                  <div className="w-1 h-2 bg-foreground/50 rounded-full animate-scroll-down group-hover:bg-foreground/70" />
                </div>
                <ChevronDown className="w-5 h-5 text-foreground/30 group-hover:text-foreground/50 transition-all animate-bounce-subtle" />
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, href }: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <LiquidGlassCard
      draggable={true}
      blurIntensity="sm"
      shadowIntensity="md"
      glowIntensity="sm"
      borderRadius="12px"
      className=""
    >
      <a
        href={href}
        title={label}
        className="group flex items-center justify-center p-3 relative z-30"
      >
        <div className="text-primary/80 group-hover:text-primary transition-colors">
          {icon}
        </div>
      </a>
    </LiquidGlassCard>
  );
}