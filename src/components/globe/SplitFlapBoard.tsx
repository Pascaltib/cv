import { useEffect, useMemo, useRef, useState } from 'react';
import { Plane } from 'lucide-react';
import { places, kindLabel } from '@/data/places';

// Solari-style split-flap departures board. Each cell clacks through the alphabet
// until it lands on its target character; rows rotate through the places list.

const FLAP_CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-:·';
const ROWS = 5;
const COLS = { city: 14, country: 16, when: 12, status: 7 };
const ROTATE_EVERY_MS = 4500;

function pad(text: string, width: number) {
  const upper = text.toUpperCase().replace(/[^A-Z0-9 \-:·]/g, (c) => {
    const map: Record<string, string> = { Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U', Ñ: 'N', Ü: 'U' };
    return map[c] ?? ' ';
  });
  return upper.slice(0, width).padEnd(width, ' ');
}

function Flap({ target, delay }: { target: string; delay: number }) {
  const [shown, setShown] = useState(target);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (shown === target) return;
    const start = window.setTimeout(() => {
      // Spin through the alphabet from the current letter to the target, like the real thing.
      let index = Math.max(0, FLAP_CHARS.indexOf(shown));
      const targetIndex = Math.max(0, FLAP_CHARS.indexOf(target));
      const tick = () => {
        index = (index + 1) % FLAP_CHARS.length;
        setShown(FLAP_CHARS[index]);
        if (index !== targetIndex) timer.current = window.setTimeout(tick, 45);
      };
      tick();
    }, delay);
    return () => {
      window.clearTimeout(start);
      if (timer.current) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  const flipping = shown !== target;
  return (
    <span
      className={`inline-flex h-7 w-[1.1ch] items-center justify-center rounded-[2px] bg-[#111] font-mono text-sm font-bold text-[#f3e9c6] shadow-[inset_0_-1px_0_rgba(255,255,255,0.08),inset_0_1px_0_rgba(0,0,0,0.6)] md:h-9 md:w-[1.2ch] md:text-lg ${
        flipping ? 'text-[#ffbf00]' : ''
      }`}
    >
      <span className="relative">
        {shown === ' ' ? ' ' : shown}
        {/* the hinge line across the middle of every flap */}
        <span className="pointer-events-none absolute inset-x-[-0.3ch] top-1/2 h-px bg-black/80" />
      </span>
    </span>
  );
}

function FlapWord({ text, width, offset }: { text: string; width: number; offset: number }) {
  const padded = pad(text, width);
  return (
    <span className="inline-flex gap-[2px]">
      {padded.split('').map((char, i) => (
        <Flap key={i} target={char} delay={offset + i * 30} />
      ))}
    </span>
  );
}

export function SplitFlapBoard({ onBoard }: { onBoard: () => void }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(places.length / ROWS));
  const countries = useMemo(() => new Set(places.map((p) => p.countryCode)).size, []);

  useEffect(() => {
    if (pages <= 1) return;
    const id = window.setInterval(() => setPage((p) => (p + 1) % pages), ROTATE_EVERY_MS);
    return () => window.clearInterval(id);
  }, [pages]);

  const rows = useMemo(() => {
    const slice = places.slice(page * ROWS, page * ROWS + ROWS);
    while (slice.length < ROWS) slice.push(null as never);
    return slice;
  }, [page]);

  return (
    <section className="relative px-4 py-16 md:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="text-glow mb-4 text-3xl text-white md:text-4xl">Departures</h2>
          <div className="mx-auto h-1 w-16 rounded-full bg-white" />
          <p className="text-glow mt-4 text-white/85">
            {countries} countries, {places.length} places, one passport full of stamps.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0b0618]/85 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xs md:p-6">
          <div className="min-w-[760px]">
            {/* header strip */}
            <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-[#ffbf00]/90">
              <span className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Places I have lived and worked
              </span>
              <span className="animate-pulse">● live</span>
            </div>

            <div className="flex gap-x-5 px-1 font-mono text-[10px] uppercase tracking-widest text-white/50 md:text-xs">
              <span style={{ width: `${COLS.city * 1.2}ch` }}>City</span>
              <span style={{ width: `${COLS.country * 1.2}ch` }}>Country</span>
              <span style={{ width: `${COLS.when * 1.2}ch` }}>When</span>
              <span style={{ width: `${COLS.status * 1.2}ch` }}>Status</span>
            </div>

            <div className="mt-2 space-y-2">
              {rows.map((place, i) => (
                <div
                  key={place ? place.id : `empty-${i}`}
                  className="flex items-center gap-x-5 rounded-md bg-black/40 px-1 py-1"
                >
                  <FlapWord text={place?.city ?? ''} width={COLS.city} offset={i * 80} />
                  <FlapWord text={place?.country ?? ''} width={COLS.country} offset={i * 80 + 120} />
                  <FlapWord text={place?.when ?? ''} width={COLS.when} offset={i * 80 + 240} />
                  <FlapWord text={place ? kindLabel[place.kind] : ''} width={COLS.status} offset={i * 80 + 360} />
                </div>
              ))}
            </div>
          </div>

          {/* Button sits on the left so the retro computer parked at the right edge never covers it */}
          <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            <button
              onClick={onBoard}
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#ffbf00]/60 bg-[#ffbf00]/10 px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.25em] text-[#ffbf00] transition-all hover:bg-[#ffbf00] hover:text-black hover:shadow-[0_0_40px_rgba(255,191,0,0.45)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Board the globe
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/50">
              Gate G · now boarding
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
