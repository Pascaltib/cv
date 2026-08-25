import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, ChevronDown, FileDown } from 'lucide-react';
import { EyeTrackingPortrait } from './EyeTrackingPortrait';
import { LiquidGlassCard } from './LiquidGlassCard';
import { Sparkles } from './Sparkles';
import { LineShadowText } from './LineShadowText';
import { HyperText } from './HyperText';
import WebcamPixelGrid from './ui/webcam-pixel-grid';
import { useMusicPlayback } from './ipod/music-playback-context';

export function CVHeader() {
  const [showScrollButton, setShowScrollButton] = useState(true);
  const [maxDistance, setMaxDistance] = useState(1000);

  // Responsive maxDistance for eye tracking based on screen width
  useEffect(() => {
    const updateMaxDistance = () => {
      const width = window.innerWidth;
      // Linear interpolation: 1000 at 1440px, 1750 at 3440px
      const minWidth = 1440;
      const maxWidth = 3440;
      const minDistance = 1000;
      const maxDistanceValue = 1750;

      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, width));
      const t = (clampedWidth - minWidth) / (maxWidth - minWidth);
      const distance = Math.round(minDistance + t * (maxDistanceValue - minDistance));

      setMaxDistance(distance);
    };

    updateMaxDistance();
    window.addEventListener('resize', updateMaxDistance);
    return () => window.removeEventListener('resize', updateMaxDistance);
  }, []);

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
      {/* Left TV with webcam grid */}
      {/* <div className="hidden lg:block absolute left-6 xl:left-8 2xl:left-0 bottom-20 z-30">
        <RetroTV />
      </div> */}

      {/* Original right CRT monitor */}
      <div className="hidden lg:block fixed right-10 2xl:right-20 bottom-20 z-50">
        <RetroComputer videoSrc="/cv/dance_color_500_30fps.mp4" />
      </div>

      <div className="relative z-10 px-0 md:px-16 flex flex-col gap-12 h-dvh">
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

            </div>

            {/* Eye-tracking portrait */}
            <div className="flex justify-center">
              <EyeTrackingPortrait
                videoSrc="/cv/pascal.mp4"
                size={250}
                maxDistance={maxDistance}
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
            <LiquidGlassCard
              draggable={true}
              blurIntensity="sm"
              shadowIntensity="md"
              glowIntensity="sm"
              borderRadius="12px"
              className=""
            >
              <a
                href="/cv/Pascal_Tiberghien_CV.pdf"
                download="Pascal_Tiberghien_CV.pdf"
                title="Download CV"
                className="group flex items-center justify-center gap-2 p-3 relative z-30"
              >
                <FileDown className="w-5 h-5 text-primary/80 group-hover:text-primary transition-colors" />
                <span className="text-sm text-primary/80 group-hover:text-primary transition-colors whitespace-nowrap">Download CV</span>
              </a>
            </LiquidGlassCard>
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

function RetroComputer({ videoSrc }: { videoSrc: string }) {
  const [size, setSize] = useState({ width: 340, height: 290 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = React.useRef({ x: 0, y: 0 });
  const { navigation, isPlaying } = useMusicPlayback();

  const currentVideoId = navigation.selectedSong?.id;
  const showYouTube = !!currentVideoId && isPlaying;

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setSize({ width: 470, height: 400 });
      } else if (width >= 1280) {
        setSize({ width: 390, height: 332 });
      } else {
        setSize({ width: 330, height: 282 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className={`relative select-none cursor-grab active:cursor-grabbing ${!isDragging ? 'transition-[width,height] duration-300' : ''}`}
      style={{
        width: size.width,
        height: size.height,
        transform: `translate(${position.x}px, ${position.y}px) rotate(6deg)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          top: '15%',
          left: '22%',
          width: '45%',
          height: '35%',
          borderRadius: '2px',
        }}
      >
        {showYouTube ? (
          <iframe
            key={currentVideoId}
            src={`https://www.youtube.com/embed/${currentVideoId}?autoplay=1&mute=1&controls=0&showinfo=0&modestbranding=1&loop=1&playlist=${currentVideoId}&playsinline=1&rel=0&iv_load_policy=3&disablekb=1`}
            allow="autoplay; encrypted-media"
            className="absolute border-0"
            style={{
              pointerEvents: 'none',
              top: '-10%',
              left: '-10%',
              width: '120%',
              height: '120%',
            }}
          />
        ) : (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Computer image - sits on top */}
      <img
        src="/cv/apple-iigs.png"
        alt=""
        className="relative z-10 w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  );
}

function RetroTV() {
  const [size, setSize] = useState({ width: 300, height: 300 });

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setSize({ width: 680, height: 680 });
      } else if (width >= 1280) {
        setSize({ width: 480, height: 480 });
      } else {
        setSize({ width: 240, height: 240 });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div
      className="relative select-none transition-[width,height] duration-300"
      style={{
        width: size.width,
        height: size.height,
        transform: 'rotate(-2deg)',
      }}
    >
      <div
        className="absolute z-20 overflow-hidden"
        style={{
          top: '22%',
          left: '23%',
          width: '45.5%',
          height: '34%',
          borderRadius: '9%',
        }}
      >
        <WebcamPixelGrid
          gridCols={48}
          gridRows={32}
          maxElevation={28}
          motionSensitivity={0.35}
          elevationSmoothing={0.2}
          colorMode="webcam"
          backgroundColor="#030303"
          mirror={true}
          gapRatio={0.06}
          invertColors={false}
          darken={0}
          borderColor="#ffffff"
          borderOpacity={0.03}
          className="h-full w-full"
        />
      </div>

      <img
        src="/cv/retro-tv.png"
        alt=""
        className="relative z-10 w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  );
}