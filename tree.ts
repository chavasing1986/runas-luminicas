import { Vector3 } from "three";
import type { NameDNA } from "../engine/nameDNA";
import type { PathLayer } from "../engine/types";
import { mulberry32 } from "../engine/random";

export function polygonPoints(
  sides: number,
  radius: number,
  rotation = 0,
  z = 0,
  warp = 0
): Vector3[] {
  const points: Vector3[] = [];
  for (let i = 0; i <= sides; i += 1) {
    const index = i % sides;
    const angle = rotation + index * Math.PI * 2 / sides;
    const modulatedRadius = radius * (1 + Math.sin(index * 1.618 + rotation) * warp);
    points.push(new Vector3(
      Math.cos(angle) * modulatedRadius,
      Math.sin(angle) * modulatedRadius,
      z
    ));
  }
  return points;
}

export function circlePoints(
  radius: number,
  segments = 128,
  rotation = 0,
  z = 0,
  scaleX = 1,
  scaleY = 1
): Vector3[] {
  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const angle = rotation + i * Math.PI * 2 / segments;
    points.push(new Vector3(
      Math.cos(angle) * radius * scaleX,
      Math.sin(angle) * radius * scaleY,
      z
    ));
  }
  return points;
}

export function spiralPoints(
  turns: number,
  radius: number,
  phase: number,
  z = 0,
  segments = 420,
  exponent = 0.7
): Vector3[] {
  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const angle = phase + t * Math.PI * 2 * turns;
    const r = radius * Math.pow(t, exponent);
    points.push(new Vector3(Math.cos(angle) * r, Math.sin(angle) * r, z));
  }
  return points;
}

export function makeLayer(
  id: string,
  points: Vector3[],
  options: Partial<Omit<PathLayer, "id" | "points">> = {}
): PathLayer {
  return {
    id,
    points,
    color: options.color ?? "#f6c65b",
    opacity: options.opacity ?? 0.8,
    width: options.width ?? 1,
    bloom: options.bloom ?? 1,
    depth: options.depth ?? 0
  };
}

export function signatureRng(dna: NameDNA, salt: string): () => number {
  let seed = dna.seed;
  for (let i = 0; i < salt.length; i += 1) seed = Math.imul(seed ^ salt.charCodeAt(i), 16777619);
  return mulberry32(seed >>> 0);
}
