"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3, Group } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe;
    };
  }
}

extend({ ThreeGlobe: ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;

type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}

// rings indices (managed per-interval)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const numbersOfRingsSeed = [0];

export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef<Group | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = useMemo<Required<GlobeConfig>>(
    () => ({
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.25)",
    globeColor: "#64748b", // neutral gray base
    emissive: "#1f2937",
    emissiveIntensity: 0.25,
    shininess: 0.9,
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#93c5fd",
    arcTime: 2400,
    arcLength: 0.85,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 47.6062, lng: -122.3321 },
    autoRotate: true,
    autoRotateSpeed: 0.9,
      ...globeConfig,
    }),
    [globeConfig]
  );

  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
  groupRef.current!.add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  // Build material when globe is ready
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;
    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
  }, [isInitialized, defaultProps.globeColor, defaultProps.emissive, defaultProps.emissiveIntensity, defaultProps.shininess]);

  // Build data
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

  const arcs = data;
  const points: Array<{ size: number; order: number; color: string; lat: number; lng: number }> = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      points.push({ size: defaultProps.pointSize, order: arc.order, color: arc.color, lat: arc.startLat, lng: arc.startLng });
      points.push({ size: defaultProps.pointSize, order: arc.order, color: arc.color, lat: arc.endLat, lng: arc.endLng });
    }

  const filteredPoints = points.filter((v, i, a) => a.findIndex((v2) => v2.lat === v.lat && v2.lng === v.lng) === i);

    globeRef.current
      .hexPolygonsData((countries as { features: object[] }).features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeRef.current
  .arcsData(data)
  .arcStartLat((d: object) => (d as Position).startLat)
  .arcStartLng((d: object) => (d as Position).startLng)
  .arcEndLat((d: object) => (d as Position).endLat)
  .arcEndLng((d: object) => (d as Position).endLng)
  .arcColor((e: object) => (e as Position).color)
  .arcAltitude((e: object) => (e as Position).arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.round(Math.random() * 2)])
      .arcDashLength(defaultProps.arcLength!)
  .arcDashInitialGap((e: object) => (e as Position).order * 1)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime!);

    globeRef.current
    .pointsData(filteredPoints)
    .pointColor((e: object) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(0.0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor!)
      .ringMaxRadius(defaultProps.maxRings!)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((defaultProps.arcTime! * defaultProps.arcLength!) / (defaultProps.rings || 1));
  }, [isInitialized, data, defaultProps]);

  // Animate rings periodically
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;
    const interval = setInterval(() => {
      const newNumbersOfRings = genRandomNumbers(0, data.length, Math.floor((data.length * 4) / 5));
      const ringsData = data
        .filter((_, i) => newNumbersOfRings.includes(i))
        .map((d) => ({ lat: d.startLat, lng: d.startLng, color: d.color }));
      globeRef.current!.ringsData(ringsData);
    }, 2000);
    return () => clearInterval(interval);
  }, [isInitialized, data]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0);
  }, [gl, size]);
  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight} position={new Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls enablePan={false} enableZoom={false} minDistance={cameraZ} maxDistance={cameraZ} autoRotate autoRotateSpeed={1} minPolarAngle={Math.PI / 3.5} maxPolarAngle={Math.PI - Math.PI / 3} />
    </Canvas>
  );
}

export function genRandomNumbers(min: number, max: number, count: number) {
  const arr: number[] = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
  return arr;
}
