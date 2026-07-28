import { Vector3 } from "three";
import type { NameDNA } from "../engine/nameDNA";
import type { SignatureModel } from "../engine/types";
import { circlePoints, makeLayer, signatureRng } from "./utils";

export function buildTree(dna: NameDNA): SignatureModel {
  const random = signatureRng(dna, "TREE");
  const primary = [];
  const secondary = [];
  const micro = [];
  const nodes = [];
  const depth = 4 + Math.min(3, Math.floor(dna.uniqueCount / 3));
  const spread = 0.28 + (dna.consonants / Math.max(1, dna.length)) * 0.28;
  const taper = 0.63 + dna.entropy * 0.08;
  let branchIndex = 0;

  function branch(start: Vector3, length: number, angle: number, level: number, z: number): void {
    if (level <= 0) return;
    const bend = Math.sin((branchIndex + 1) * 1.618 + dna.sum * 0.03) * 0.11;
    const end = new Vector3(
      start.x + Math.cos(angle + bend) * length,
      start.y + Math.sin(angle + bend) * length,
      z + (random() - 0.5) * 0.08
    );
    primary.push(makeLayer(`branch-${branchIndex}`, [start, end], {
      width: 1.45 * (level / depth) + 0.22,
      opacity: 0.5 + level / depth * 0.35,
      bloom: level > depth - 2 ? 1 : 0.45
    }));
    if (level <= 2) {
      nodes.push({
        id: `leaf-${branchIndex}`,
        position: end.clone(),
        size: 0.03 + random() * 0.025,
        color: random() > 0.32 ? "#ffe5a0" : "#dffcff",
        intensity: 1 + random()
      });
    }
    branchIndex += 1;
    const letterValue = dna.values[branchIndex % dna.values.length] ?? 1;
    const localSpread = spread * (0.82 + letterValue / 54);
    branch(end, length * taper, angle - localSpread, level - 1, z + 0.015);
    branch(end, length * taper, angle + localSpread, level - 1, z - 0.015);
    if ((branchIndex + dna.sum) % 4 === 0) {
      branch(end, length * taper * 0.82, angle + localSpread * 0.12, level - 1, z);
    }
  }

  branch(new Vector3(0, -2.1, 0), 0.95, Math.PI / 2, depth, 0);

  for (let ring = 0; ring < dna.rings + 3; ring += 1) {
    secondary.push(makeLayer(`root-${ring}`, circlePoints(
      0.4 + ring * 0.34,
      96,
      Math.PI,
      -0.04,
      1,
      0.28
    ).map((point) => point.add(new Vector3(0, -2.1, 0))), {
      width: 0.5,
      opacity: 0.18,
      bloom: 0.22
    }));
  }

  for (let i = 0; i < 16 + dna.length; i += 1) {
    const angle = Math.PI + (i / (15 + dna.length)) * Math.PI;
    micro.push(makeLayer(`root-thread-${i}`, [
      new Vector3(0, -2.1, -0.05),
      new Vector3(Math.cos(angle) * (0.8 + random() * 1.3), -2.1 + Math.sin(angle) * (0.25 + random() * 0.4), -0.08)
    ], { width: 0.22, opacity: 0.12, bloom: 0.1 }));
  }

  return { family: "tree", primary, secondary, micro, nodes, coreRadius: 0.18, outerRadius: 2.45 };
}
