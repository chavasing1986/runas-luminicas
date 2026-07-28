import { Vector3 } from "three";
import type { NameDNA } from "../engine/nameDNA";
import type { SignatureModel } from "../engine/types";
import { circlePoints, makeLayer, polygonPoints, signatureRng } from "./utils";

export function buildCrystal(dna: NameDNA): SignatureModel {
  const random = signatureRng(dna, "CRYSTAL");
  const primary = [];
  const secondary = [];
  const micro = [];
  const nodes = [];
  const sides = dna.outerSides;
  const phase = (dna.values[0] - 1) * Math.PI * 2 / 27;
  const outer = polygonPoints(sides, 2.28, phase, 0, 0.04 + dna.entropy * 0.05);

  primary.push(makeLayer("outer", outer, { width: 1.4, opacity: 0.82, bloom: 1.1 }));

  const vertices = outer.slice(0, -1);
  vertices.forEach((vertex, index) => {
    primary.push(makeLayer(`radial-${index}`, [vertex, new Vector3(0, 0, (index % 2 ? 0.1 : -0.08))], {
      width: 0.8,
      opacity: 0.5,
      bloom: 0.55
    }));
    const skip = 1 + (dna.values[index % dna.values.length] % Math.max(2, sides - 2));
    secondary.push(makeLayer(`chord-${index}`, [vertex, vertices[(index + skip) % sides]], {
      width: 0.42,
      opacity: 0.24,
      bloom: 0.22
    }));
    nodes.push({
      id: `vertex-${index}`,
      position: vertex.clone().setZ(0.05),
      size: 0.03 + random() * 0.02,
      color: index % 3 === 0 ? "#dffcff" : "#ffe5a0",
      intensity: 1 + random()
    });
  });

  for (let ring = 1; ring <= dna.rings + 3; ring += 1) {
    const ratio = 0.16 + ring * 0.16;
    micro.push(makeLayer(`inner-${ring}`, polygonPoints(
      sides,
      2.28 * ratio,
      phase + ring * 0.15,
      ring * 0.018,
      0.02
    ), { width: 0.34, opacity: 0.13, bloom: 0.15 }));
  }

  secondary.push(makeLayer("halo", circlePoints(2.42, 180, phase * 0.2, -0.05), {
    width: 0.5,
    opacity: 0.2,
    bloom: 0.28
  }));

  return { family: "crystal", primary, secondary, micro, nodes, coreRadius: 0.2, outerRadius: 2.5 };
}
