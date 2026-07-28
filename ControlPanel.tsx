import type { Vector3 } from "three";
export type RuneStyle="ceremonial"|"technical"|"minimal"|"jovian";
export interface PathLayer{id:string;points:Vector3[];color:string;opacity:number;width:number;bloom:number;depth:number}
export interface NodePoint{id:string;position:Vector3;size:number;color:string;intensity:number}
export interface RuneModel{style:RuneStyle;primary:PathLayer[];secondary:PathLayer[];micro:PathLayer[];nodes:NodePoint[];coreRadius:number;outerRadius:number;title:string;descriptors:string[]}
