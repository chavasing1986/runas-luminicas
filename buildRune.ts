import { Vector3 } from "three";
import type { NameDNA } from "../engine/nameDNA";
import type { SignatureModel } from "../engine/types";
import { circlePoints, makeLayer, polygonPoints, signatureRng } from "./utils";

export function buildMerkaba(dna: NameDNA): SignatureModel {
  const random = signatureRng(dna, "MERKABA");
  const primary = [];
  const secondary = [];
  const micro = [];
  const nodes = [];
  const layers = 3 + dna.rings;
  const phase = (dna.values[0] - 1) * Math.PI * 2 / 27;

  for (let layer = 0; layer < layers; layer += 1) {
    const radius = 0.75 + layer * 0.38 + random() * 0.08;
    const twist = phase + layer * (0.11 + dna.entropy * 0.16);
    primary.push(makeLayer(`up-${layer}`, polygonPoints(3, radius, -Math.PI / 2 + twist, layer * 0.035, 0.025), {
      width: 1.35,
      opacity: 0.84 - layer * 0.07,
      bloom: 1.15
    }));
    primary.push(makeLayer(`down-${layer}`, polygonPoints(3, radius * (0.94 + random() * 0.05), Math.PI / 2 - twist * 0.77, -layer * 0.03, 0.018), {
      width: 1.1,
      opacity: 0.74 - layer * 0.06,
      bloom: 0.9
    }));
    secondary.push(makeLayer(`ring-${layer}`, circlePoints(radius * 0.48, 160, twist * 0.3, layer * 0.02), {
      width: 0.55,
      opacity: 0.25,
      bloom: 0.3
    }));
  }

  const spokes = dna.axes + dna.vowels;
  for (let i = 0; i < spokes; i += 1) {
    const angle = phase + i * Math.PI * 2 / spokes;
    const r = 2.15 + random() * 0.25;
    micro.push(makeLayer(`spoke-${i}`, [
      new Vector3(Math.cos(angle) * 0.22, Math.sin(angle) * 0.22, 0),
      new Vector3(Math.cos(angle) * r, Math.sin(angle) * r, (random() - 0.5) * 0.15)
    ], { width: 0.35, opacity: 0.18, bloom: 0.2 }));
    nodes.push({
      id: `node-${i}`,
      position: new Vector3(Math.cos(angle) * r, Math.sin(angle) * r, 0.06),
      size: 0.032 + random() * 0.024,
      color: i % 3 === 0 ? "#dffcff" : "#ffe5a0",
      intensity: 1.2 + random()
    });
  }

  return { family: "merkaba", primary, secondary, micro, nodes, coreRadius: 0.22, outerRadius: 2.4 };
}
