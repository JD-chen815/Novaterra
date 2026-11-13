import * as T from '../vendor/three/build/three.module.js';
import config from '../project.config.js';
import{LAYOUT}from'../layout.config.js';
import{buildScene}from'../scene.js';
import{createRuntime}from'./core/runtime.js';
import{createRandom}from'./core/random.js';
import{createLighting}from'./core/lighting.js';
import{createSignage}from'./world/signage.js';
import{createTerrain}from'./world/terrain.js';
import{createActors}from'./actors/models.js';
import{createSimulation}from'./systems/simulation.js';
import{bindToolbar}from'./ui/toolbar.js';
try{
 await Promise.all([document.fonts.load('600 24px "Noto Devanagari"','गुलाबी शहर जयपुर चाय कपड़े हस्तशिल्प प्रवेश'),document.fonts.load('700 24px "Noto Devanagari"','JAIPUR CHAI')]);await document.fonts.ready;
 const ctx=createRuntime(config);ctx.signage=createSignage(ctx);ctx.terrain=createTerrain(ctx);const layout=buildScene(ctx);ctx.groundHeight=layout.groundHeight;ctx.batch.flush();
 const actors=createActors({...ctx,...createRandom(config.seed^0x9e3779b9)}),simulation=createSimulation({...ctx,...createRandom(config.seed^0x243f6a88)},layout,actors),lighting=createLighting(ctx);let flight=null,disposed=false,restorationState='';
 function focus(name){const v=LAYOUT.presets[name];if(!v)return;ctx.setOrbit(false);if(matchMedia('(prefers-reduced-motion: reduce)').matches){ctx.camera.position.set(...v.position);ctx.controls.target.set(...v.target);ctx.camera.zoom=v.zoom;ctx.camera.updateProjectionMatrix();ctx.controls.update();}else flight={p:ctx.camera.position.clone(),t:ctx.controls.target.clone(),z:ctx.camera.zoom,to:new T.Vector3(...v.position),target:new T.Vector3(...v.target),zoom:v.zoom,start:performance.now()};document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));}
 const ui=bindToolbar(ctx,simulation,focus);ctx.controls.addEventListener('start',()=>flight=null);
 const world={ready:true,config,ctx,layout,simulation,setTime:ui.setTime,cycle:kind=>{const m=simulation.cycle(kind);ui.refresh();return m},focus,reset:()=>focus('whole'),diagnostics:()=>({state:{...ctx.state},camera:{position:ctx.camera.position.toArray(),target:ctx.controls.target.toArray(),zoom:ctx.camera.zoom},lighting:lighting.diagnostics(),toon:{materialCount:[...ctx.materials.values()].filter(m=>m.isMeshToonMaterial).length,gradientSteps:ctx.gradient.image.width},architecture:layout.metrics(),buildings:layout.buildings,performance:{...ctx.renderStats,pixelRatio:ctx.renderer.getPixelRatio(),quality:ctx.state.quality},simulation:simulation.diagnostics()}),dispose(){if(disposed)return;disposed=true;ui.dispose();layout.dispose();ctx.dispose();}};
 window.littleWorld=world;window.__sceneReady=true;
 ctx.start(dt=>{lighting.update(dt);simulation.update(dt);const rs=Object.values(simulation.pendingRestoration).join();if(rs!==restorationState){restorationState=rs;ui.refresh();}layout.update(dt);if(flight){const u=Math.min(1,(performance.now()-flight.start)/1250),s=u*u*(3-2*u);ctx.camera.position.lerpVectors(flight.p,flight.to,s);ctx.controls.target.lerpVectors(flight.t,flight.target,s);ctx.camera.zoom=T.MathUtils.lerp(flight.z,flight.zoom,s);ctx.camera.updateProjectionMatrix();if(u===1)flight=null;}});
 addEventListener('pagehide',e=>{if(!e.persisted)world.dispose();});
}catch(error){console.error(error);document.querySelector('#world-load-status').textContent='Unable to start Jaipur: '+error.message;throw error;}
