import { Vector3 } from "three";
import type { NameDNA } from "./nameDNA";
import type { RuneModel,RuneStyle,PathLayer } from "./types";
const GOLD="#f6c65b",CYAN="#dffcff";
const L=(id:string,points:Vector3[],width=1,opacity=.8,color=GOLD,depth=0):PathLayer=>({id,points,color,opacity,width,bloom:1,depth});
function arc(cx:number,cy:number,rx:number,ry:number,start:number,end:number,rot=0,z=0,n=72){const pts:Vector3[]=[];const c=Math.cos(rot),s=Math.sin(rot);for(let i=0;i<=n;i++){const t=start+(end-start)*i/n,x=Math.cos(t)*rx,y=Math.sin(t)*ry;pts.push(new Vector3(cx+x*c-y*s,cy+x*s+y*c,z))}return pts}
function diamond(cx:number,cy:number,w:number,h:number,z=0){return[new Vector3(cx,cy+h,z),new Vector3(cx+w,cy,z),new Vector3(cx,cy-h,z),new Vector3(cx-w,cy,z),new Vector3(cx,cy+h,z)]}
function circle(cx:number,cy:number,r:number,z=0){return arc(cx,cy,r,r,0,Math.PI*2,0,z,96)}
export function buildRune(dna:NameDNA,style:RuneStyle):RuneModel{
 const primary:PathLayer[]=[],secondary:PathLayer[]=[],micro:PathLayer[]=[];const nodes:any[]=[];
 const phase=(dna.values[0]-1)*Math.PI*2/27,exit=((dna.values.at(-1)??1)-1)*Math.PI*2/27;
 const structural=dna.consonants>=dna.vowels,repeated=Object.values(dna.repetitions).filter(c=>c>1).length,crossbars=1+dna.digitalRoot%3,loops=1+dna.vowels%3,half=.58+dna.vowelRatio*.24;
 const spine:Vector3[]=[];for(let i=0;i<=96;i++){const t=i/96,y=2.65-t*5.3,x=Math.sin(t*Math.PI*(2+dna.digitalRoot%3)+phase)*(.03+dna.entropy*.06)+Math.sin(t*Math.PI*2+exit)*.025;spine.push(new Vector3(x,y,.08))}
 primary.push(L("spine",spine,1.9,.96,GOLD,.08));
 for(let i=0;i<loops;i++){const sc=1-i*.14,rx=half*sc,ry=.72*sc;primary.push(L("up"+i,arc(0,1.18+i*.07,rx,ry,-Math.PI/2,Math.PI*1.5,phase*.08,.06-i*.02,100),1.5-i*.18,.86-i*.12));primary.push(L("lo"+i,arc(0,-1.18-i*.07,rx,ry,Math.PI/2,Math.PI*2.5,-exit*.08,.06-i*.02,100),1.5-i*.18,.86-i*.12))}
 for(let i=0;i<crossbars;i++){const y=(i-(crossbars-1)/2)*.34,w=.62+(dna.values[i%dna.values.length]??1)/52,tilt=structural?0:(i%2?.09:-.09);primary.push(L("bar"+i,[new Vector3(-w,y-tilt,.1),new Vector3(w,y+tilt,.1)],1.45,.92))}
 const top=(dna.values[0]??1)%6,bottom=(dna.values.at(-1)??1)%6;
 secondary.push(L("crown",top===1?circle(0,2.45,.28,.04):diamond(0,2.38,.28+top*.025,.42,.04),.85,.48));
 secondary.push(L("base",bottom===1?circle(0,-2.45,.25,.02):diamond(0,-2.38,.25+bottom*.02,.38,.02),.82,.42));
 for(let i=0;i<repeated;i++){const o=.11+i*.08;secondary.push(L("el"+i,[new Vector3(-o,1.7,-.02),new Vector3(-o*1.35,0,-.02),new Vector3(-o,-1.7,-.02)],.45,.18));secondary.push(L("er"+i,[new Vector3(o,1.7,-.02),new Vector3(o*1.35,0,-.02),new Vector3(o,-1.7,-.02)],.45,.18))}
 const slots=Math.min(10,dna.length);for(let i=0;i<slots;i++){const v=dna.values[i]??1,y=1.85-i*(3.7/Math.max(1,slots-1)),side=i%2===0?-1:1,reach=.22+(v%7)*.035,a=(v-1)*Math.PI*2/27,x1=side*reach,y1=y+Math.sin(a)*.14;micro.push(L("arm"+i,[new Vector3(side*.02,y,-.05),new Vector3(x1,y1,-.05)],.34,.16));if("AEIOU".includes(dna.letters[i]))micro.push(L("v"+i,arc(x1,y1,.12,.09,0,Math.PI*1.6,a*.2,-.04,28),.32,.15,CYAN));else micro.push(L("t"+i,[new Vector3(x1,y1,-.04),new Vector3(x1-side*.08,y1+.11,-.04)],.3,.14))}
 [new Vector3(0,0,.13),new Vector3(0,1.18,.1),new Vector3(0,-1.18,.1)].forEach((p,i)=>nodes.push({id:"n"+i,position:p,size:i===0?.055:.028,color:i===0?CYAN:"#ffe6a4",intensity:i===0?2.4:1.1}));
 const descriptors=[structural?"Estructura":"Flujo",dna.axes>=7?"Expansión":"Concentración",repeated?"Resonancia":"Continuidad",dna.digitalRoot>=6?"Manifestación":"Interiorización"],title=`${dna.initial}${dna.final}-${dna.digitalRoot}${dna.axes}`;
 const m={ceremonial:[1,1,1],technical:[.82,.78,1.25],minimal:[.95,.25,0],jovian:[1.1,1.15,1.3]}[style];
 primary.forEach(x=>{x.width*=m[0];if(style==="technical"){x.opacity*=.78;x.color="#d8e7ef"}});secondary.forEach(x=>{x.width*=m[1];x.opacity*=m[1]});micro.forEach(x=>{x.width*=m[2];x.opacity*=m[2]});
 return{style,primary,secondary,micro,nodes,coreRadius:.09,outerRadius:2.9,title,descriptors}
}
