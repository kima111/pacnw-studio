"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

type GearSpec = {
  teeth: number;
  radius: number; // base outer radius (without tooth depth)
  toothDepth: number;
  innerRadius: number; // hole radius
  thickness?: number;
  color?: string;
  label: string;
  blurb: string;
  // Optional speed multiplier for this gear (1 = unchanged)
  speedMultiplier?: number;
  // Optional per-gear label controls
  // Relative offset [x,y,z] for the label from the gear center. If omitted, defaults to alternating above/below.
  labelOffset?: [number, number, number];
  // Control label size relative to camera distance. Higher = larger.
  labelDistanceFactor?: number;
};

function createGearGeometry({
  teeth,
  radius,
  toothDepth,
  innerRadius,
  thickness = 1.2,
}: Pick<GearSpec, "teeth" | "radius" | "toothDepth" | "innerRadius"> & { thickness?: number }) {
  const steps = teeth * 2; // alternating outer and notched radii
  const shape = new THREE.Shape();
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = i % 2 === 0 ? radius : radius - toothDepth;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  // center hole
  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: thickness,
    bevelEnabled: false,
  });
  // center geometry and rotate to face camera
  geom.rotateX(-Math.PI / 2);
  geom.center();
  return geom;
}

function Gear({ spec, x, speed, index, isDark }: { spec: GearSpec; x: number; speed: number; index: number; isDark: boolean }) {
  const ref = React.useRef<THREE.Group>(null);
  const tilt = React.useMemo(() => THREE.MathUtils.degToRad(15), []);
  const { size } = useThree();
  const geom = React.useMemo(
    () =>
      createGearGeometry({
        teeth: spec.teeth,
        radius: spec.radius,
        toothDepth: spec.toothDepth,
        innerRadius: spec.innerRadius,
        // Much thicker gears for more presence
        thickness: spec.thickness ?? 1.2,
      }),
    [spec.teeth, spec.radius, spec.toothDepth, spec.innerRadius, spec.thickness]
  );
  const edges = React.useMemo(() => new THREE.EdgesGeometry(geom), [geom]);
  const baseColor = isDark ? (spec.color ?? "#cbd5e1") : "#4b5563"; // slate-200 vs slate-600
  const edgeColor = isDark ? "#ffffff" : "#000000";
  const emissiveColor = isDark ? "#ffffff" : "#000000";
  const edgeOpacity = isDark ? 0.95 : 0.85;

  // Respect reduced motion
  const prefersReducedMotion = React.useMemo(
    () => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useFrame((_, dt) => {
    if (!ref.current) return;
    if (!prefersReducedMotion) ref.current.rotation.y += speed * dt;
  });

  return (
    <group position={[x, 0, 0]}>
  {/* Rotating assembly: base + wireframe + axle (tilted toward viewer) */}
  <group ref={ref} rotation-x={tilt}>
          <mesh geometry={geom} castShadow receiveShadow>
            {/* ~20% opaque with slight emissive to ensure visibility */}
            <meshStandardMaterial color={baseColor} roughness={0.75} metalness={0.18} transparent opacity={0.2} emissive={emissiveColor} emissiveIntensity={isDark ? 0.22 : 0.12} />
          </mesh>
          {/* Crisp white edges */}
          <lineSegments geometry={edges}>
            <lineBasicMaterial color={edgeColor} transparent opacity={edgeOpacity} />
          </lineSegments>
      </group>
      {/* label (responsive position and size) */}
        <Html
          center
          position={(() => {
            const def: [number, number, number] = [0, index % 2 === 0 ? -(spec.radius + 4.5) : (spec.radius + 1.5), 0];
            const p = (spec.labelOffset ?? def) as [number, number, number];
            // Scale offsets inward on small screens
            const w = size.width;
            const ui = w < 380 ? 0.7 : w < 640 ? 0.82 : w < 1024 ? 0.92 : 1;
            return [p[0] * ui, p[1] * ui, p[2]] as [number, number, number];
          })()}
          transform
          sprite
          distanceFactor={(() => {
            const base = spec.labelDistanceFactor ?? 12;
            const w = size.width;
            // Slightly reduce distance factor on small screens (makes label a bit larger)
            return w < 380 ? base * 0.8 : w < 640 ? base * 0.9 : base;
          })()}
        >
          <div className="rounded-sm dark:bg-slate-500/75 px-2.5 py-1 text-center text-slate-900 dark:text-white ring-1 ring-white/15 backdrop-blur border border-teal-500/60">
            <div className="text-xl font-semibold md:text-lg">{spec.label}</div>
            <div className="mt-0.5 max-w-[580px] text-[12px] text-slate-900/90 dark:text-white/90 md:text-md">{spec.blurb}</div>
        </div>
      </Html>
    </group>
  );
}

// Adjust camera for small screens to keep gears in frame
function ResponsiveRig() {
  const { camera, size } = useThree();
  React.useEffect(() => {
    const w = size.width;
    const y = w < 380 ? 3.2 : w < 640 ? 3.8 : 4.5;
    const z = w < 380 ? 33 : w < 640 ? 30 : 26;
    camera.position.set(0, y, z);
    camera.updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

// Scale the whole scene slightly on smaller screens
function ResponsiveGroup({ children }: { children: React.ReactNode }) {
  const { size } = useThree();
  const w = size.width;
  const s = w < 380 ? 0.78 : w < 640 ? 0.88 : w < 1024 ? 0.95 : 1;
  return <group scale={[s, s, s]}>{children}</group>;
}

// Connectors removed to avoid any line cutting through the gears

type GearTimelineProps = {
  /** When true (default), gear speeds are locked by gear ratios. */
  physicsLocked?: boolean;
  /** Which gear in the chain is the driver when physicsLocked=true. Default 0 (leftmost). */
  driverIndex?: number;
  /** Angular speed in rad/s for the driver when physicsLocked=true. Default 0.6 */
  driverOmega?: number;
  /** Provide explicit per-gear angular speeds (rad/s). Used only when physicsLocked=false. */
  freeSpinSpeeds?: number[];
};

export default function GearTimeline({
  physicsLocked = true,
  driverIndex = 0,
  driverOmega = 0.6,
  freeSpinSpeeds,
}: GearTimelineProps = {}) {
  const [isDark, setIsDark] = React.useState(false);
  React.useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    const onThemeChange: EventListener = () => update();
    update();
    window.addEventListener("themechange", onThemeChange);
    const mo = new MutationObserver(update);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => { window.removeEventListener("themechange", onThemeChange); mo.disconnect(); };
  }, []);
  // Base gear specs (scaled up later)
  const specs: GearSpec[] = [
    {
      label: "Automation",
      blurb: "Years of in‑house tools that remove repetition and speed delivery.",
      teeth: 16,
      radius: 3.2,
      toothDepth: 0.6,
      innerRadius: 1.0,
      thickness: 0.9,
      color: "#9ca3af",
      labelOffset: [-2, -5.5, 0],
      labelDistanceFactor: 12,
    },
    {
      label: "Collaboration",
      blurb: "Tight review loops and shared context keep teams in sync.",
      teeth: 24,
      radius: 4.8,
      toothDepth: 0.7,
      innerRadius: 1.4,
      color: "#a3a3a3",
      labelOffset: [-1, 4.85, 0],
      labelDistanceFactor: 12,
    },
    {
      label: "Proven tech",
      blurb: "Battle‑tested stack and patterns that don’t break under load.",
      teeth: 12,
      radius: 2.6,
      toothDepth: 0.55,
      innerRadius: 0.9,
      color: "#94a3b8",
      labelOffset: [1, -6.5, 0],
      labelDistanceFactor: 12,
    },
    {
      label: "AI‑assisted",
      blurb: "Automation + human taste forces multiply impact, not busywork.",
      teeth: 20,
      radius: 4.0,
      toothDepth: 0.6,
      innerRadius: 1.2,
      color: "#9aa1aa",
      labelOffset: [1, 4, 0],
      labelDistanceFactor: 12,
    },
  ];

  // Normalize gear radii using a constant module so pitch radii scale with teeth
  // pitch radius rp = (module * teeth) / 2, outer radius ro = rp + toothDepth/2
  const moduleSize = 0.36;
  const toothDepth = 0.5;
  const gearSpecs: GearSpec[] = specs.map((s) => ({
    ...s,
    toothDepth,
    radius: (moduleSize * s.teeth) / 2 + toothDepth / 2,
  }));

  // Compute positions so gears mesh: center distance = sum of pitch radii
  // Pitch radius is (outer radius - toothDepth/2) which equals rp above
  const pitchR = (s: GearSpec) => s.radius - s.toothDepth / 2;
  const xPositions: number[] = [-10.5, -3, 3.75, 9.75];
  gearSpecs.forEach((s, i) => {
    if (i === 1) {
      xPositions.push(0);
    } else if (i === 0) {
      xPositions.push(-(pitchR(gearSpecs[0]) + pitchR(gearSpecs[1])));
    } else {
      xPositions.push(xPositions[i - 1] + (pitchR(gearSpecs[i - 1]) + pitchR(s)));
    }
  });

  // Compute angular speeds
  const speeds: number[] = new Array(gearSpecs.length).fill(0);
  if (!physicsLocked && Array.isArray(freeSpinSpeeds)) {
    // Free-spin mode: assign per-gear speeds directly (pad or truncate as needed)
    for (let i = 0; i < speeds.length; i++) {
      speeds[i] = freeSpinSpeeds[i] ?? 0;
    }
  } else {
    // Physics-locked: derive from a chosen driver gear's speed using gear ratios
    const di = Math.min(Math.max(0, driverIndex), gearSpecs.length - 1);
    speeds[di] = driverOmega;
    // Propagate to the right
    for (let i = di + 1; i < gearSpecs.length; i++) {
      const ratio = gearSpecs[i - 1].teeth / gearSpecs[i].teeth;
      speeds[i] = -speeds[i - 1] * ratio;
    }
    // Propagate to the left
    for (let i = di - 1; i >= 0; i--) {
      const ratio = gearSpecs[i + 1].teeth / gearSpecs[i].teeth;
      speeds[i] = -speeds[i + 1] * ratio;
    }
  }
  // Apply optional per-gear multipliers
  for (let i = 0; i < speeds.length; i++) {
    const mult = gearSpecs[i].speedMultiplier ?? 1;
    speeds[i] *= mult;
  }

  return (
  <div className="relative h-[420px] w-full overflow-hidden rounded-md border border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-sm ring-1 ring-white/40 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:ring-white/10 sm:h-[500px] md:h-[630px]">
      {/* subtle grid background (separate for light/dark) */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 hidden dark:block"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff12 1px,transparent 1px),linear-gradient(90deg,#ffffff12 1px,transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
          backgroundPosition: "0 0, 0 0",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 dark:hidden"
        style={{
          backgroundImage:
            "linear-gradient(#00000010 1px,transparent 1px),linear-gradient(90deg,#00000010 1px,transparent 1px)",
          backgroundSize: "48px 48px, 48px 48px",
          backgroundPosition: "0 0, 0 0",
        }}
      />
  <Canvas shadows camera={{ position: [0, 4.5, 26], fov: 45 }} className="absolute inset-0 z-10 !h-full !w-full">
        {/* lights */}
  <ambientLight intensity={isDark ? 0.85 : 0.7} />
  <directionalLight position={[6, 8, 6]} intensity={1.2} castShadow />
        <directionalLight position={[-6, 5, 4]} intensity={0.4} />

        {/* floor removed to prevent visual line/plane intersecting gears */}

        {/* Scale up the entire timeline scene for readability */}
  {/* Natural scale for clarity and spacing */}
  <ResponsiveGroup>
          <ResponsiveRig />
          {/* connectors removed */}

          {/* gears */}
          {gearSpecs.map((s, i) => (
            <Gear key={i} spec={s} x={xPositions[i]} speed={speeds[i]} index={i} isDark={isDark} />
          ))}

        </ResponsiveGroup>
      </Canvas>
    </div>
  );
}
