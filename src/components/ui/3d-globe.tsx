"use client";
import React, { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "./utils";

// ============================================================================
// Types
// ============================================================================

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label?: string;
  size?: number;
}

export interface Globe3DConfig {
  /** Globe radius */
  radius?: number;
  /** Globe base color (used as fallback or tint) */
  globeColor?: string;
  /** URL to the Earth texture map */
  textureUrl?: string;
  /** URL to the bump/elevation map for terrain */
  bumpMapUrl?: string;
  /** Whether to show atmosphere glow */
  showAtmosphere?: boolean;
  /** Atmosphere color */
  atmosphereColor?: string;
  /** Atmosphere intensity */
  atmosphereIntensity?: number;
  /** Atmosphere blur/softness (higher = more diffuse, default 3) */
  atmosphereBlur?: number;
  /** Terrain bump scale (0 = flat, higher = more pronounced) */
  bumpScale?: number;
  /** Auto rotate speed (0 = disabled) */
  autoRotateSpeed?: number;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Min zoom distance */
  minDistance?: number;
  /** Max zoom distance */
  maxDistance?: number;
  /** Initial rotation */
  initialRotation?: { x: number; y: number };
  /** Marker diameter in CSS pixels; markers keep this size on screen at every zoom level */
  markerSize?: number;
  /** Show wireframe overlay */
  showWireframe?: boolean;
  /** Wireframe color */
  wireframeColor?: string;
  /** Ambient light intensity */
  ambientIntensity?: number;
  /** Point light intensity */
  pointLightIntensity?: number;
  /** Background color (null for transparent) */
  backgroundColor?: string | null;
}

interface Globe3DProps {
  /** Array of markers to display on the globe */
  markers?: GlobeMarker[];
  /** Globe configuration */
  config?: Globe3DConfig;
  /** Additional CSS classes */
  className?: string;
  /** Callback when a marker is clicked */
  onMarkerClick?: (marker: GlobeMarker) => void;
  /** Callback when a marker is hovered */
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

// ============================================================================
// Constants - Earth Texture URLs (NASA Blue Marble)
// ============================================================================

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert latitude/longitude to 3D cartesian coordinates
 */
function latLngToVector3(
  lat: number,
  lng: number,
  radius: number,
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// ============================================================================
// Marker layer: screen-sized pins that cluster when they overlap on screen
// ============================================================================

interface MarkerLayerProps {
  markers: GlobeMarker[];
  radius: number;
  /** Marker diameter in CSS pixels; constant on screen regardless of zoom */
  markerSize: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
  /** Returns true if the camera flew closer, false if it is already at the closest zoom */
  onClusterClick?: (direction: THREE.Vector3, members: GlobeMarker[]) => boolean;
}

interface MarkerPoint {
  dir: THREE.Vector3;
  surface: THREE.Vector3;
  top: THREE.Vector3;
}

interface Cluster {
  key: string;
  members: number[];
  direction: THREE.Vector3;
}

// Top of the pin line as a multiple of the globe radius
const PIN_HEIGHT = 1.08;
// Markers facing away from the camera beyond this are hidden
const FACING_THRESHOLD = 0.15;

function lineBetween(from: THREE.Vector3, to: THREE.Vector3) {
  const center = from.clone().lerp(to, 0.5);
  const direction = to.clone().sub(from).normalize();
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  return { center, quaternion, length: from.distanceTo(to) };
}

function MarkerLayer({ markers, radius, markerSize, onClick, onHover, onClusterClick }: MarkerLayerProps) {
  const { camera, size } = useThree();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const signature = useRef("");
  const frame = useRef(0);

  const points = useMemo<MarkerPoint[]>(
    () =>
      markers.map((m) => {
        const dir = latLngToVector3(m.lat, m.lng, 1);
        return {
          dir,
          surface: dir.clone().multiplyScalar(radius * 1.001),
          top: dir.clone().multiplyScalar(radius * PIN_HEIGHT),
        };
      }),
    [markers, radius],
  );

  // Re-cluster about ten times a second. Projecting a hundred points is cheap; React updates are not,
  // so state only changes when the grouping actually changes.
  useFrame(() => {
    if (frame.current++ % 6 !== 0) return;
    const camDir = camera.position.clone().normalize();
    const screen = points.map((p) => {
      if (p.dir.dot(camDir) < FACING_THRESHOLD) return null;
      const ndc = p.top.clone().project(camera);
      return new THREE.Vector2(((ndc.x + 1) / 2) * size.width, ((1 - ndc.y) / 2) * size.height);
    });
    const threshold = markerSize * 1.15;
    const assigned = new Array<boolean>(points.length).fill(false);
    const next: Cluster[] = [];
    for (let i = 0; i < points.length; i++) {
      const si = screen[i];
      if (assigned[i] || !si) continue;
      const members = [i];
      assigned[i] = true;
      for (let j = i + 1; j < points.length; j++) {
        const sj = screen[j];
        if (assigned[j] || !sj) continue;
        if (si.distanceTo(sj) < threshold) {
          members.push(j);
          assigned[j] = true;
        }
      }
      const direction = members
        .reduce((acc, k) => acc.add(points[k].dir), new THREE.Vector3())
        .normalize();
      next.push({ key: members.join("-"), members, direction });
    }
    const sig = next.map((c) => c.key).join("|");
    if (sig !== signature.current) {
      signature.current = sig;
      setClusters(next);
    }
  });

  return (
    <group>
      {/* Every place keeps a dot on the surface, even while folded into a cluster */}
      {points.map((p, i) => (
        <mesh key={`dot-${i}`} position={p.surface}>
          <sphereGeometry args={[radius * 0.0015, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      ))}
      {clusters.map((c) =>
        c.members.length === 1 ? (
          <SingleMarker
            key={c.key}
            marker={markers[c.members[0]]}
            point={points[c.members[0]]}
            size={markerSize}
            onClick={onClick}
            onHover={onHover}
          />
        ) : (
          <ClusterMarker
            key={c.key}
            cluster={c}
            markers={markers}
            radius={radius}
            size={markerSize}
            onClick={onClusterClick}
            onSelect={onClick}
          />
        ),
      )}
    </group>
  );
}

interface SingleMarkerProps {
  marker: GlobeMarker;
  point: MarkerPoint;
  size: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function SingleMarker({ marker, point, size, onClick, onHover }: SingleMarkerProps) {
  const [hovered, setHovered] = useState(false);
  const line = useMemo(() => lineBetween(point.surface, point.top), [point]);
  const pixels = marker.size ?? size;

  return (
    <group>
      <mesh position={line.center} quaternion={line.quaternion}>
        <cylinderGeometry args={[0.003, 0.003, line.length, 6]} />
        <meshBasicMaterial color={hovered ? "#ffffff" : "#94a3b8"} transparent opacity={0.7} />
      </mesh>
      <group position={point.top}>
        <Html center zIndexRange={[10, 0]}>
          <div
            className="relative"
            style={{ width: pixels, height: pixels }}
            onMouseEnter={() => {
              setHovered(true);
              onHover?.(marker);
            }}
            onMouseLeave={() => {
              setHovered(false);
              onHover?.(null);
            }}
            onClick={() => onClick?.(marker)}
          >
            <div
              className={cn(
                "h-full w-full cursor-pointer overflow-hidden rounded-full border-2 border-white/80 bg-neutral-900 shadow-lg transition-transform duration-150",
                hovered && "scale-125 ring-2 ring-white/60",
              )}
            >
              <img
                src={marker.src}
                alt={marker.label || "Marker"}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
            {marker.label && (
              <div
                className={cn(
                  "pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/85 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-white shadow transition-opacity duration-150",
                  hovered ? "opacity-100" : "opacity-0",
                )}
              >
                {marker.label}
              </div>
            )}
          </div>
        </Html>
      </group>
    </group>
  );
}

interface ClusterMarkerProps {
  cluster: Cluster;
  markers: GlobeMarker[];
  radius: number;
  size: number;
  onClick?: (direction: THREE.Vector3, members: GlobeMarker[]) => boolean;
  onSelect?: (marker: GlobeMarker) => void;
}

function ClusterMarker({ cluster, markers, radius, size, onClick, onSelect }: ClusterMarkerProps) {
  const [hovered, setHovered] = useState(false);
  // When the camera can't get any closer, the cluster opens as a list of its places instead
  const [expanded, setExpanded] = useState(false);
  const top = useMemo(
    () => cluster.direction.clone().multiplyScalar(radius * PIN_HEIGHT),
    [cluster.direction, radius],
  );
  const preview = cluster.members.slice(0, 3).map((i) => markers[i]);
  const box = size * 1.4;

  return (
    <group position={top}>
      <Html center zIndexRange={[10, 0]}>
        <div
          className={cn("relative cursor-pointer transition-transform duration-150", hovered && "scale-110")}
          style={{ width: box, height: box }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            if (expanded) {
              setExpanded(false);
              return;
            }
            const flew = onClick?.(cluster.direction, cluster.members.map((i) => markers[i]));
            if (!flew) setExpanded(true);
          }}
          title={`${cluster.members.length} places, click to zoom in`}
        >
          {preview.map((m, k) => (
            <img
              key={k}
              src={m.src}
              alt=""
              draggable={false}
              className="absolute rounded-full border-2 border-white/80 bg-neutral-900 object-cover shadow-lg"
              style={{ width: size * 0.85, height: size * 0.85, left: k * size * 0.25, top: k * size * 0.12 }}
            />
          ))}
          <div className="absolute -bottom-1 -right-1 rounded-full bg-[#ffbf00] px-1.5 py-px font-mono text-[11px] font-bold text-black shadow">
            {cluster.members.length}
          </div>
          <div
            className={cn(
              "pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/85 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-white shadow transition-opacity duration-150",
              hovered && !expanded ? "opacity-100" : "opacity-0",
            )}
          >
            {cluster.members.length} places · zoom in
          </div>
        </div>
        {expanded && (
          <ul
            className="absolute left-1/2 top-full mt-2 min-w-[180px] -translate-x-1/2 overflow-hidden rounded-xl border border-white/15 bg-black/90 py-1 shadow-xl backdrop-blur"
            onMouseEnter={() => setHovered(false)}
          >
            {cluster.members.map((i) => {
              const m = markers[i];
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(false);
                      onSelect?.(m);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left font-mono text-xs uppercase tracking-wider text-white hover:bg-white/10"
                  >
                    <img src={m.src} alt="" className="h-5 w-5 rounded-full border border-white/60 object-cover" draggable={false} />
                    <span className="whitespace-nowrap">{m.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Html>
    </group>
  );
}

// ============================================================================
// Rotating Globe with Markers (all rotate together)
// ============================================================================

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
  onClusterClick?: (direction: THREE.Vector3, members: GlobeMarker[]) => void;
}

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
  onClusterClick,
}: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load Earth textures
  const [earthTexture, bumpTexture] = useTexture([
    config.textureUrl,
    config.bumpMapUrl,
  ]);

  // Configure textures
  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 16;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 8;
    }
  }, [earthTexture, bumpTexture]);

  // Create geometries
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 96, 96);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  return (
    <group ref={groupRef}>
      {/* Main globe mesh with Earth texture */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {/* Wireframe overlay */}
      {config.showWireframe && (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      <MarkerLayer
        markers={markers}
        radius={config.radius}
        markerSize={config.markerSize}
        onClick={onMarkerClick}
        onHover={onMarkerHover}
        onClusterClick={onClusterClick}
      />
    </group>
  );
}

// ============================================================================
// Atmosphere Component (stays static - doesn't rotate)
// ============================================================================

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  // blur controls the fresnel exponent: lower = more diffuse, higher = sharper edge
  // We invert it so higher blur value = more diffuse (lower exponent)
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

// ============================================================================
// Scene Component
// ============================================================================

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function Scene({ markers, config, onMarkerClick, onMarkerHover }: SceneProps) {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls) as any;
  const flight = useRef<{ direction: THREE.Vector3; distance: number } | null>(null);

  // Clicking a cluster flies the camera over it and halves the distance until the pins separate.
  const flyTo = useCallback(
    (direction: THREE.Vector3) => {
      const current = camera.position.length();
      const distance = Math.max(config.minDistance, current * 0.55);
      // Already as close as allowed and looking at the spot: nothing to fly to
      const facing = camera.position.clone().normalize().dot(direction) > 0.995;
      if (current - config.minDistance < 0.05 && facing) return false;
      flight.current = { direction: direction.clone(), distance };
      return true;
    },
    [camera, config.minDistance],
  );

  // Any manual drag or wheel cancels an in-progress flight.
  React.useEffect(() => {
    if (!controls) return;
    const cancel = () => {
      flight.current = null;
    };
    controls.addEventListener("start", cancel);
    return () => controls.removeEventListener("start", cancel);
  }, [controls]);

  useFrame(() => {
    const f = flight.current;
    if (f) {
      const pos = camera.position;
      const dist = THREE.MathUtils.lerp(pos.length(), f.distance, 0.12);
      const dir = pos.clone().normalize().lerp(f.direction, 0.12).normalize();
      pos.copy(dir.multiplyScalar(dist));
      camera.lookAt(0, 0, 0);
      if (dir.distanceTo(f.direction) < 0.002 && Math.abs(dist - f.distance) < 0.005) {
        flight.current = null;
      }
    }
    // Stop the idle spin once the viewer has zoomed in to look at something.
    if (controls && config.autoRotateSpeed > 0) {
      controls.autoRotate = camera.position.length() > config.radius * 2.4;
    }
  });

  // Set initial camera position (pulled back to accommodate markers)
  React.useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.5);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      {/* Rotating Globe with Markers */}
      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
        onClusterClick={flyTo}
      />

      {/* Atmosphere (static) */}
      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      {/* Controls */}
      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        autoRotate={config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

// ============================================================================
// Loading Fallback
// ============================================================================

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex shrink-0 flex-col items-center gap-3">
        <span className="inline-block shrink-0 text-sm text-neutral-400">
          Loading globe...
        </span>
      </div>
    </Html>
  );
}

// ============================================================================
// Main Globe3D Component
// ============================================================================

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2,
  globeColor: "#1a1a2e",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: false,
  atmosphereColor: "#4da6ff",
  atmosphereIntensity: 0.5,
  atmosphereBlur: 2,
  bumpScale: 1,
  autoRotateSpeed: 0.3,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0, y: 0 },
  markerSize: 40,
  showWireframe: false,
  wireframeColor: "#4a9eff",
  ambientIntensity: 0.6,
  pointLightIntensity: 1.5,
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config],
  );

  return (
    <div className={cn("relative h-[500px] w-full", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.5],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            markers={markers}
            config={mergedConfig}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;
