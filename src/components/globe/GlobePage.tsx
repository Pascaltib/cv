import { useEffect, useMemo, useState } from 'react';
import { X, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Globe3D, type GlobeMarker } from '@/components/ui/3d-globe';
import { places, kindLabel, type Place, type PlaceImage } from '@/data/places';
import { useLiteMode } from '@/hooks/use-media-query';

// Full-screen globe. Loaded lazily from App so Three.js only ships when someone boards.

const flagFor = (code: string) => `https://flagcdn.com/w640/${code.toLowerCase()}.png`;

export default function GlobePage({ onClose }: { onClose: () => void }) {
  const lite = useLiteMode();
  const [selected, setSelected] = useState<Place | null>(null);
  // Index into selected.images for the full-screen viewer
  const [lightbox, setLightbox] = useState<number | null>(null);

  const markers = useMemo<(GlobeMarker & { place: Place })[]>(
    () =>
      places.map((place) => ({
        lat: place.lat,
        lng: place.lng,
        label: place.city,
        src: place.markerImage ?? flagFor(place.countryCode),
        place,
      })),
    []
  );

  useEffect(() => {
    const images = selected?.images ?? [];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightbox !== null) setLightbox(null);
        else if (selected) setSelected(null);
        else onClose();
      }
      if (lightbox !== null && images.length > 1) {
        if (e.key === 'ArrowRight') setLightbox((lightbox + 1) % images.length);
        if (e.key === 'ArrowLeft') setLightbox((lightbox - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, selected, lightbox]);

  const config = useMemo(
    () => ({
      textureUrl: '/cv/globe/earth-blue-marble.jpg',
      bumpMapUrl: '/cv/globe/earth-topology.png',
      bumpScale: lite ? 0 : 4,
      showAtmosphere: true,
      atmosphereColor: '#0aa9ff',
      atmosphereIntensity: 0.45,
      atmosphereBlur: 4,
      ambientIntensity: 1.4,
      pointLightIntensity: 2.2,
      autoRotateSpeed: 0.35,
      enableZoom: true,
      minDistance: 2.6,
      maxDistance: 12,
      markerSize: lite ? 34 : 40,
      initialRotation: { x: 0.2, y: -0.4 },
    }),
    [lite]
  );

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#0b0618]/85 backdrop-blur-sm">
      {/* top bar */}
      <div className="relative z-[60] flex items-center justify-between px-5 py-4 md:px-8">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-[#ffbf00]">
          ● in flight · {places.length} stops
        </div>
        <button
          onClick={onClose}
          aria-label="Close globe"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 transition hover:scale-105 hover:bg-white hover:text-black"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1">
        <Globe3D
          className="h-full w-full"
          markers={markers}
          config={config}
          onMarkerClick={(marker) => {
            setLightbox(null);
            setSelected((marker as GlobeMarker & { place: Place }).place);
          }}
        />

        {!selected && (
          <p className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center font-mono text-xs uppercase tracking-[0.25em] text-white/60">
            drag to spin · scroll to zoom · tap a flag for the story
          </p>
        )}

        {/* story panel: side sheet on desktop, bottom sheet on phones */}
        {selected && (
          <aside className="absolute inset-x-0 bottom-0 z-20 z-[60] max-h-[70%] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-[#0b0618]/95 p-6 shadow-[0_-20px_60px_rgba(0,0,0,0.6)] md:inset-y-6 md:left-auto md:right-6 md:max-h-none md:w-[380px] md:rounded-3xl md:border">
            <button
              onClick={() => {
                setLightbox(null);
                setSelected(null);
              }}
              aria-label="Close story"
              className="absolute right-4 top-4 text-white/50 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <img
                src={selected.markerImage ?? flagFor(selected.countryCode)}
                alt=""
                className="h-8 w-12 rounded object-cover shadow"
              />
              <div>
                <h3 className="text-xl font-semibold text-white">{selected.city}</h3>
                <div className="flex items-center gap-1 text-sm text-white/60">
                  <MapPin className="h-3.5 w-3.5" />
                  {selected.country}
                </div>
              </div>
            </div>
            <div className="mt-4 flex gap-2 font-mono text-[11px] uppercase tracking-widest">
              <span className="rounded-full border border-[#ffbf00]/50 px-2 py-0.5 text-[#ffbf00]">
                {kindLabel[selected.kind]}
              </span>
              {selected.when && (
                <span className="rounded-full border border-white/20 px-2 py-0.5 text-white/70">{selected.when}</span>
              )}
            </div>
            <p className="mt-4 leading-relaxed text-white/85">
              {selected.story ?? 'Story coming soon.'}
            </p>
            {selected.images && selected.images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-2">
                {selected.images.map((image, index) => (
                  <figure
                    key={image.src}
                    className="group relative cursor-zoom-in overflow-hidden rounded-xl"
                    onClick={() => setLightbox(index)}
                  >
                    <img
                      src={image.src}
                      alt={image.caption ?? ''}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {image.caption && (
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-6 text-[11px] leading-tight text-white/90">
                        {image.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </aside>
        )}

        {/* full-screen image viewer */}
        {selected?.images && lightbox !== null && selected.images[lightbox] && (
          <Lightbox
            images={selected.images}
            index={lightbox}
            onChange={setLightbox}
            onClose={() => setLightbox(null)}
          />
        )}
      </div>
    </div>
  );
}

function Lightbox({
  images,
  index,
  onChange,
  onClose,
}: {
  images: PlaceImage[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const image = images[index];
  const many = images.length > 1;
  const step = (delta: number) => onChange((index + delta + images.length) % images.length);

  return (
    <div
      className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-black/90 p-4 md:p-10"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close image"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 hover:bg-white hover:text-black"
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={image.src}
        alt={image.caption ?? ''}
        className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="mt-4 flex max-w-2xl items-center gap-4 text-center" onClick={(e) => e.stopPropagation()}>
        {many && (
          <button onClick={() => step(-1)} aria-label="Previous image" className="rounded-full border border-white/20 p-2 text-white/80 hover:bg-white hover:text-black">
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        <div>
          {image.caption && <p className="text-sm text-white/90">{image.caption}</p>}
          {many && (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-white/50">
              {index + 1} / {images.length}
            </p>
          )}
        </div>
        {many && (
          <button onClick={() => step(1)} aria-label="Next image" className="rounded-full border border-white/20 p-2 text-white/80 hover:bg-white hover:text-black">
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}
