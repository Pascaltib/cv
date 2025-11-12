import React from 'react';
import { Mail, Phone, Linkedin, Github } from 'lucide-react';
import { EyeTrackingPortrait } from './EyeTrackingPortrait';
import { LiquidGlassCard } from './LiquidGlassCard';
import { Sparkles } from './Sparkles';

export function CVHeader() {
  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 px-8 pt-20 pb-8 md:px-16 md:pt-24">
        <div className="max-w-5xl mx-auto flex justify-between items-start gap-12">
          <div className="flex-1">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl text-foreground mb-6 tracking-tight">
                Pascal Tiberghien
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                Full Stack Developer
              </p>
              <div className="w-24 h-1 bg-linear-to-r from-primary to-secondary mx-auto rounded-full"></div>
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
          </div>

          <div className="flex flex-col gap-6 w-fit min-w-[280px]">
            <ContactItem
              icon={<Mail className="w-5 h-5" />}
              label="Email"
              value="pascaltib@gmail.com"
              href="mailto:pascaltib@gmail.com"
            />
            <ContactItem
              icon={<Phone className="w-5 h-5" />}
              label="Phone"
              value="+34 645587412"
              href="tel:+34645587412"
            />
            <ContactItem
              icon={<Linkedin className="w-5 h-5" />}
              label="LinkedIn"
              value="pascaltib"
              href="https://linkedin.com/in/pascaltib"
            />
            <ContactItem
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
              value="Pascaltib"
              href="https://github.com/Pascaltib"
            />
          </div>
        </div>

        <div className='relative h-56 w-full overflow-hidden mt-12 flex flex-col items-center'>
          <div className='absolute inset-x-0 top-0 flex justify-center'>
            <div className='bg-linear-to-r from-transparent via-gray-500 to-transparent h-[2px] w-1/2 blur-xs' />
          </div>
          <div className='absolute inset-x-0 top-0 flex justify-center'>
            <div className='bg-linear-to-r from-transparent via-gray-400 to-transparent h-px w-1/2' />
          </div>
          <div className='absolute inset-x-0 top-0 flex justify-center'>
            <div className='bg-linear-to-r from-transparent via-gray-50 to-transparent h-px w-1/4' />
          </div>

          <Sparkles
            density={1200}
            mousemove={true}
            className='absolute inset-x-0 -mt-24 top-0 h-full w-full mask-[radial-gradient(50%_50%,white,transparent_55%)]'
          />

          {/* Intentionally no scroll indicator */}
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, label, value, href }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <LiquidGlassCard
      draggable={true}
      blurIntensity="lg"
      shadowIntensity="sm"
      glowIntensity="xs"
      borderRadius="12px"
      className="border border-border transition-all duration-300"
    >
      <a
        href={href}
        className="group flex items-center gap-3 p-4 relative z-30"
      >
        <div className="text-primary/80 group-hover:text-primary transition-colors">
          {icon}
        </div>
        <div>
          <p className="text-muted-foreground text-sm">{label}</p>
          <p className="text-foreground truncate">{value}</p>
        </div>
      </a>
    </LiquidGlassCard>
  );
}