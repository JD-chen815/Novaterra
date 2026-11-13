import * as THREE from '../../vendor/three/build/three.module.js';
import {createRandom} from './random.js';
export function createLighting(ctx){
 const {scene,state,M,emissives,nightLights,streetLampBulb,streetLampDayColor,streetLampNightColor,windowNightColors}=ctx,cfg=ctx.config;
 if(ctx.floor){ctx.floor.material.dispose();ctx.floor.material=new THREE.MeshBasicMaterial({color:'#3b4052'});}
 const hemi=new THREE.HemisphereLight('#a3b9e5','#514357',1.05);scene.add(hemi);
 const key=new THREE.DirectionalLight('#abc9ef',1);key.position.set(-25,40,16);key.castShadow=cfg.visual.shadows;key.shadow.mapSize.set(ctx.economy?1024:2048,ctx.economy?1024:2048);const bound=Math.max(cfg.terrain.width,cfg.terrain.depth)*.8;Object.assign(key.shadow.camera,{left:-bound,right:bound,top:bound,bottom:-bound,near:1,far:140});key.shadow.bias=-.0003;key.shadow.normalBias=.025;key.shadow.radius=3.5;key.shadow.camera.far=220;scene.add(key);
 const fill=new THREE.DirectionalLight('#f1b383',.65);fill.position.set(30,19,16);scene.add(fill);
 const day=new THREE.Color(cfg.lighting.dayBackground),night=new THREE.Color(cfg.lighting.nightBackground),dayFloor=new THREE.Color('#9bafbc'),nightFloor=new THREE.Color('#152944');let nightAmount=state.timeMode==='sunset'?.72:state.night?1:0,sunsetAmount=state.timeMode==='sunset'?1:0;const sunset=new THREE.Color(cfg.lighting.sunsetBackground??'#9b6a69');
 const {random,rr}=createRandom(cfg.seed^0x7f4a7c15);let rain=null;
 if(cfg.weather.preset==='rain'){
  const positions=new Float32Array(cfg.weather.rainCount*3);for(let i=0;i<positions.length;i+=3){positions[i]=rr(-cfg.terrain.width/2,cfg.terrain.width/2);positions[i+1]=rr(1,24);positions[i+2]=rr(-cfg.terrain.depth/2,cfg.terrain.depth/2);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(positions,3));rain=new THREE.Points(g,new THREE.PointsMaterial({color:'#b8d0dd',size:.06,transparent:true,opacity:.55,depthWrite:false}));scene.add(rain);
 }
 const distance=ctx.camera.position.distanceTo(ctx.controls.target),mist=cfg.weather.preset!=='clear';scene.fog.near=distance+(mist?-8:20);scene.fog.far=distance+(mist?75:140);
 function update(dt){
  const target=state.timeMode==='sunset'?.72:state.night?1:0;sunsetAmount=THREE.MathUtils.lerp(sunsetAmount,state.timeMode==='sunset'?1:0,1-Math.exp(-dt*2.2));if(Math.abs(sunsetAmount-(state.timeMode==='sunset'?1:0))<.002)sunsetAmount=state.timeMode==='sunset'?1:0;nightAmount=THREE.MathUtils.lerp(nightAmount,target,1-Math.exp(-dt*2.2));if(Math.abs(nightAmount-target)<.002)nightAmount=target;const n=nightAmount;
  // Three authored light rigs: warm low sun / cool moon / neutral day.
  // Interpolate lights and exposure as well as background and emission.
  const u=sunsetAmount,mix=(d,k,s)=>THREE.MathUtils.lerp(THREE.MathUtils.lerp(d,k,n),s,u);
  scene.background.copy(day).lerp(night,n).lerp(sunset,u);scene.fog.color.copy(scene.background);
  hemi.intensity=mix(1.85,.80,1.3);
  hemi.color.set('#b5d0df').lerp(new THREE.Color('#8ca8d1'),n).lerp(new THREE.Color('#a5b7c9'),u);
  hemi.groundColor.set('#615c4d').lerp(new THREE.Color('#3a4059'),n).lerp(new THREE.Color('#8a6146'),u);
  key.intensity=mix(2.7,.68,2.45);
  key.color.set('#fff0d2').lerp(new THREE.Color('#a3bde9'),n).lerp(new THREE.Color('#ffdbac'),u);
  key.position.set(mix(-30,-28,-51),mix(48,44,17),mix(25,18,22));
  key.shadow.bias=-.00015;key.shadow.normalBias=.035;key.shadow.radius=4;
  fill.color.set('#a9c6de').lerp(new THREE.Color('#7896c7'),n).lerp(new THREE.Color('#94afc5'),u);
  fill.position.set(32,18,-20);fill.intensity=mix(.45,.38,.36);
  ctx.renderer.toneMappingExposure=mix(1.05,1.16,1.06);
  const artificial=mix(0,1,.43);
  for(const m of emissives)m.emissiveIntensity=m.userData.nightEmission*(m.userData.signage?(.0+.72*artificial):artificial*(m.userData.typography?1.18:.92));
  for(const [i,m]of[M.warm,M.warmDim].entries()){m.color.copy(M.windowDark.color).lerp(windowNightColors[i],artificial);m.emissiveIntensity=m.userData.nightEmission*artificial;}
  streetLampBulb.color.copy(streetLampDayColor).lerp(streetLampNightColor,artificial);streetLampBulb.emissiveIntensity=1.8*artificial;
  for(const {l,power,role}of nightLights)l.intensity=power*artificial*(role==='canopy'?.72:role==='street'?.68:.56);
  ctx.signage.glowMat.opacity=.22*artificial;ctx.bloom.strength=(ctx.economy?.15:cfg.lighting.bloom)*artificial;
  ctx.bloom.threshold=1.04;ctx.bloom.radius=.40;
  if(ctx.floor)ctx.floor.material.color.copy(dayFloor).lerp(nightFloor,n).lerp(new THREE.Color('#3d3740'),u);
  if(rain&&!state.paused){const a=rain.geometry.attributes.position;for(let i=0;i<a.count;i++){let x=a.getX(i)+dt*cfg.weather.wind,y=a.getY(i)-dt*9;if(y<.8){y=24;x=rr(-cfg.terrain.width/2,cfg.terrain.width/2);}if(x>cfg.terrain.width/2)x=-cfg.terrain.width/2;a.setXYZ(i,x,y,a.getZ(i));}a.needsUpdate=true;}
 }
 update(10);
 return {update,diagnostics:()=>({nightAmount,sunsetAmount,timeMode:state.timeMode,keyColor:key.color.getHexString(),keyPosition:key.position.toArray(),keyIntensity:key.intensity,ambientIntensity:hemi.intensity,localLights:nightLights.length,windowColor:M.warm.color.getHexString(),unlitColor:M.windowDark.color.getHexString(),windowEmission:M.warm.emissiveIntensity,bulbColor:streetLampBulb.color.getHexString(),bulbEmission:streetLampBulb.emissiveIntensity,weather:cfg.weather.preset,rainPoints:rain?cfg.weather.rainCount:0})};
}
