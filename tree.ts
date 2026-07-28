import { Vector3 } from "three";
import type { NameDNA } from "../engine/nameDNA";
import type { SignatureModel } from "../engine/types";
import { circlePoints, makeLayer, signatureRng } from "./utils";

export function buildFlower(dna: NameDNA): SignatureModel {
  const random = signatureRng(dna, "FLOWER");
  const primary = [];
  const secondary = [];
  const micro = [];
  const nodes = [];
  const rows = 2 + dna.rings;
  const baseRadius = 0.48 + dna.vowelRatio * 0.18;
  const phase = (dna.sum % 360) * Math.PI / 180;

  primary.push(makeLayer("outer", circlePoints(2.35, 220, phase * 0.1), { width: 1.25, opacity: 0.72, bloom: 1 }));

  for (let row = 0; row <= rows; row += 1) {
    const count = 6 + row * (2 + dna.vowels);
    const orbitalRadius = row * (0.46 + dna.entropy * 0.13);
    for (let i = 0; i < count; i += 1) {
      const angle = phase + i * Math.PI * 2 / count + row * 0.17;
      const cx = Math.cos(angle) * orbitalRadius;
      const cy = Math.sin(angle) * orbitalRadius;
      const scaleX = 0.86 + random() * 0.22;
      const scaleY = 0.86 + random() * 0.22;
      const points = circlePoints(baseRadius * (1 - row * 0.025), 96, angle * 0.16, row * 0.018, scaleX, scaleY)
        .map((point) => point.add(new Vector3(cx, cy, 0)));
      primary.push(makeLayer(`petal-${row}-${i}`, points, {
        width: row === 0 ? 1.2 : 0.72,
        opacity: Math.max(0.18, 0.62 - row * 0.08),
        bloom: row < 2 ? 0.9 : 0.3
      }));
      if (row > 0 && i % 2 === 0) {
        nodes.push({
          id: `node-${row}-${i}`,
          position: new Vector3(cx, cy, 0.03 + row * 0.01),
          size: 0.025 + random() * 0.018,
          color: i % 4 === 0 ? "#dffcff" : "#ffe5a0",
          intensity: 1 + random()
        });
      }
    }
  }

  const filaments = 18 + dna.uniqueCount * 2;
  for (let i = 0; i < filaments; i += 1) {
    const angle = phase + i * Math.PI * 2 / filaments;
    micro.push(makeLayer(`filament-${i}`, [
      new Vector3(Math.cos(angle) * 0.18, Math.sin(angle) * 0.18, -0.02),
      new Vector3(Math.cos(angle + 0.22) * 2.25, Math.sin(angle + 0.22) * 2.25, 0.04)
    ], { width: 0.25, opacity: 0.12, bloom: 0.15 }));
  }

  secondary.push(makeLayer("inner-ring", circlePoints(0.62, 120, phase * 0.5, 0.02), { width: 0.65, opacity: 0.34, bloom: 0.45 }));

  return { family: "flower", primary, secondary, micro, nodes, coreRadius: 0.2, outerRadius: 2.45 };
}
