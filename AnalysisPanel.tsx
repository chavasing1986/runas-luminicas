import {create} from "zustand";import type{RuneStyle}from"../engine/types";
interface S{name:string;style:RuneStyle;intensity:number;autoRotate:boolean;setName:(v:string)=>void;setStyle:(v:RuneStyle)=>void;setIntensity:(v:number)=>void;setAutoRotate:(v:boolean)=>void}
export const useRuneStore=create<S>(set=>({name:"SALVADOR",style:"ceremonial",intensity:1.5,autoRotate:false,setName:name=>set({name}),setStyle:style=>set({style}),setIntensity:intensity=>set({intensity}),setAutoRotate:autoRotate=>set({autoRotate})}));
