import { Vector3 } from "three";
import type { NameDNA } from "../engine/nameDNA";
import type { SignatureModel } from "../engine/types";
import { circlePoints, makeLayer, signatureRng, spiralPoints } from "./utils";

export function buildVortex(dna: NameDNA): SignatureModel {
  const random = signatureRng(dna, "VORTEX");
  const primary = [];
  const secondary = [];
  const micro = [];
  const nodes = [];
  const arms = dna.axes + (dna.values[0] % 4);
  const turns = 2.5 + dna.digitalRoot * 0.34;
  const phase = (dna.sum % 360) * Math.PI / 180;

  for (let arm = 0; arm < arms; arm += 1) {
    const points = spiralPoints(turns, 2.35, phase + arm * Math.PI * 2 / arms, (arm - arms / 2) * 0.01, 460, 0.56 + dna.entropy * 0.28);
    primary.push(makeLayer(`arm-${arm}`, points, {
      width: 1.05 - arm / arms * 0.28,
      opacity: 0.68,
      bloom: 1
    }));
  }

  for (let ring = 1; ring <= dna.rings + 3; ring += 1) {
    secondary.push(makeLayer(`ring-${ring}`, circlePoints(ring * 0.28, 144, phase * 0.2, ring * 0.01), {
      width: 0.45,
      opacity: 0.18,
      bloom: 0.2
    }));
  }

  const microArms = arms * 2 + dna.length;
  for (let arm = 0; arm < microArms; arm += 1) {
    micro.push(makeLayer(`micro-${arm}`, spiralPoints(
      turns * (0.72 + random() * 0.22),
      2.25,
      phase + arm * Math.PI * 2 / microArms + random() * 0.15,
      -0.03,
      300,
      0.65 + random() * 0.25
    ), { width: 0.22, opacity: 0.1, bloom: 0.12 }));
  }

  for (let i = 0; i < dna.uniqueCount + dna.rings; i += 1) {
    const angle = phase + i * Math.PI * 2 / (dna.uniqueCount + dna.rings);
    const radius = 0.6 + (i / Math.max(1, dna.uniqueCount + dna.rings - 1)) * 1.45;
    nodes.push({
      id: `node-${i}`,
      position: new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.05),
      size: 0.03 + random() * 0.02,
      color: i % 3 === 0 ? "#dffcff" : "#ffe5a0",
      intensity: 1.1 + random()
    });
  }

  return { family: "vortex", primary, secondary, micro, nodes, coreRadius: 0.25, outerRadius: 2.45 };
}
