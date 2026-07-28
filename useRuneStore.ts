import type { NameDNA } from "./nameDNA";
import type { FamilyId, SignatureModel } from "./types";
import { buildMerkaba } from "../families/merkaba";
import { buildFlower } from "../families/flower";
import { buildVortex } from "../families/vortex";
import { buildTree } from "../families/tree";
import { buildCrystal } from "../families/crystal";

export function buildSignature(dna: NameDNA, family: FamilyId): SignatureModel {
  switch (family) {
    case "merkaba": return buildMerkaba(dna);
    case "flower": return buildFlower(dna);
    case "vortex": return buildVortex(dna);
    case "tree": return buildTree(dna);
    case "crystal": return buildCrystal(dna);
  }
}
