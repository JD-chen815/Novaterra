import * as THREE from '../../vendor/three/build/three.module.js';
export function createActors(ctx){
const {scene,M,mat,random,rr,pick,state,emissives}=ctx,clamp=THREE.MathUtils.clamp;const {geo}=ctx.batch;const labels=ctx.config.traffic.labels;
const {signMat}=ctx.signage;const dynamicParts=[],trafficRoots=[];
const clips=[new THREE.Plane(new THREE.Vector3(1,0,0),ctx.config.terrain.width/2),new THREE.Plane(new THREE.Vector3(-1,0,0),ctx.config.terrain.width/2),new THREE.Plane(new THREE.Vector3(0,0,1),ctx.config.terrain.depth/2),new THREE.Plane(new THREE.Vector3(0,0,-1),ctx.config.terrain.depth/2)];
function part(parent,kind,m,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){const mesh=new THREE.Mesh(geo[kind],m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.rotation.set(rx,ry,rz);parent.add(mesh);dynamicParts.push(mesh);return mesh;}
function pivot(parent,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);parent.add(g);return g;}
const clothing=['#bf604c','#d9c6a4','#365b73','#6e7b59','#404855','#d1b265','#91a4a1','#675b76','#c18d89','#73839b','#a1b0c1','#dfddd1','#263d53'].map(c=>mat(c));
const people=[];
function character(index){const root=new THREE.Group();scene.add(root);const child=index%11===0,elder=index%13===0&&index%11!==0,height=child?rr(.85,.98):elder?rr(1.05,1.15):rr(1.10,1.30),bodyWidth=rr(.30,.39),skin=pick([M.skin1,M.skin2,M.skin3,M.skin4]),shirt=clothing[index%clothing.length],trousers=pick([M.dark,M.black,M.slate,M.maroon]),hair=elder?M.hair3:pick([M.hair,M.hair2]);root.scale.setScalar(height);
 part(root,'box',shirt,0,.72,0,bodyWidth,.43,.22);part(root,'box',skin,0,.97,0,.10,.12,.10);part(root,'round',skin,0,1.10,0,.135,.16,.13);
 const hairStyle=index%5;part(root,'round',hair,0,1.19,-.025,.14,.08,.135);if(hairStyle===0){part(root,'box',hair,0,1.08,-.10,.25,.2,.09);}if(hairStyle===1)part(root,'round',hair,0,1.17,-.16,.08,.08,.08);if(hairStyle===2)part(root,'box',hair,.095,1.13,-.025,.07,.16,.2);if(hairStyle===3){part(root,'box',shirt,0,1.25,.025,.27,.05,.27);part(root,'box',shirt,0,1.23,.15,.24,.025,.12);}
 for(const x of[-.05,.05])part(root,'box',M.black,x,1.11,.126,.023,.024,.015);
 if(index%7===0){part(root,'box',M.iron,0,1.11,.14,.23,.025,.015);part(root,'box',M.cream,0,.86,.118,.07,.23,.025);}
 const arms=[],legs=[];for(const side of[-1,1]){const arm=pivot(root,side*(bodyWidth/2+.055),.88,0);part(arm,'box',shirt,0,-.13,0,.085,.30,.11);part(arm,'round',skin,0,-.32,.015,.055,.06,.05);arms.push(arm);const leg=pivot(root,side*.09,.50,0);part(leg,'box',trousers,0,-.20,0,.11,.40,.13);part(leg,'box',M.black,0,-.39,.055,.135,.10,.23);legs.push(leg);}
 if(!child&&index%6===0){part(root,'box',shirt,0,.47,0,bodyWidth,.18,.22);part(root,'box',M.cream,.065,.75,.145,.07,.35,.02);}
 const dress=!child&&index%8===2;if(dress)part(root,'cone',shirt,0,.46,0,.25,.43,.23,Math.PI);
 const accessory=index%6;if(accessory===0){part(root,'box',pick([M.red,M.wood,M.green]),0,.72,-.19,.26,.31,.15);for(const side of[-1,1])part(root,'box',M.iron,side*.12,.78,.11,.025,.29,.025);}if(accessory===1){part(arms[0],'box',M.woodLight,0,-.47,.02,.24,.28,.12);part(arms[0],'box',M.cream,0,-.31,.02,.1,.08,.025);}if(accessory===2){part(root,'box',M.maroon,.25,.51,-.02,.20,.23,.14);part(root,'box',M.wood,.18,.75,.13,.025,.37,.025,0,0,-.3);}
 if(index>30&&index%17===0){part(root,'cyl',M.iron,.25,1.17,.04,.012,1.1,.012);part(root,'cone',pick([M.blue,M.jade,M.red]),.25,1.78,.04,.61,.24,.61);}
 if(elder)part(arms[1],'cyl',M.wood,0,-.57,.08,.018,.68,.018);
 const p={root,arms,legs,index,height,child,elder,dress,hairStyle,accessory,phase:rr(0,Math.PI*2),speed:rr(.48,.83)*(child?1.1:elder?.75:1),mode:'walking',wait:0,path:null,segment:0,progress:0,walkDistance:0};people.push(p);return p;}
function pose(p,moving,dt,sitting=false){const t=state.pedTime,pulse=p.walkDistance*9+p.phase;for(let i=0;i<2;i++){const sign=i===0?1:-1;p.legs[i].rotation.x=sitting?-1.35:moving?Math.sin(pulse)*.48*sign:Math.sin(t*.65+p.phase)*.015;p.arms[i].rotation.x=sitting?-.6+Math.sin(t*1.1+p.phase+i)*.17:moving?-Math.sin(pulse)*.38*sign:-.04+Math.sin(t*.9+p.phase+i)*.055;p.arms[i].rotation.z=(i===0?-.06:.06)+(p.mode==='socializing'?Math.sin(t*1.5+p.phase)*.08:0);}p.root.position.y=(sitting?1.23-p.height*.5:(ctx.groundHeight?.(p.root.position.x,p.root.position.z)??.815)-.06*p.height)+(moving?Math.abs(Math.sin(pulse))*.018:Math.sin(t*.7+p.phase)*.008);}
const vehicleMaterials=new Map();function vm(m){if(!vehicleMaterials.has(m)){const clone=m.clone();clone.clippingPlanes=clips;clone.clipShadows=true;if(m.userData.nightEmission){clone.userData.nightEmission=m.userData.nightEmission;emissives.push(clone);}vehicleMaterials.set(m,clone);}return vehicleMaterials.get(m);}
function car(type,color,rider=true){const root=new THREE.Group();scene.add(root);trafficRoots.push(root);const wheels=[],bus=type==='bus',van=type==='van',scooter=type==='scooter';const rickshaw=type==='rickshaw';const pickup=type==='pickup',rv=type==='rv',semi=type==='semi',moto=type==='motorcycle',muscle=type==='muscle';const L=rickshaw?2.55:semi?7.2:rv?4.3:pickup?3.2:bus?4.6:van?2.9:(scooter||moto)?1.65:muscle?3.05:2.6,W=rickshaw?1.52:semi?1.65:rv?1.6:pickup?1.3:bus?1.55:van?1.34:(scooter||moto)?.58:muscle?1.3:1.14;
 const lamps=[];
 const darkHead=mat('#a9a798'),darkTail=mat('#6b2923');
 const add=(kind,m,x,y,z,a,b,c,rx=0,ry=0,rz=0)=>{
  const mesh=part(root,kind,vm(m),x,y,z,a,b,c,rx,ry,rz);
  if(m===M.lamp||m===M.neonRed){
   // Both states are registered before instancing, so switching lights
   // neither mutates a shared material nor creates new draw batches.
   const off=part(root,kind,vm(m===M.lamp?darkHead:darkTail),x,y,z,a,b,c,rx,ry,rz);
   off.userData.agentVisible=false;lamps.push({on:mesh,off});
  }
  return mesh;
 };
 if(rickshaw){
 // One outer shell; open sides, passenger bench and a genuinely curved canvas roof.
 add('box',M.black,0,.35,-.10,.93,.20,1.95);add('box',color,0,.49,-.23,1.16,.15,1.64);
 add('bevel',color,0,.69,.87,.80,.62,.72);add('box',M.black,0,.81,-.94,1.17,.57,.16);
 add('box',color,0,.64,-.93,1.22,.33,.18);add('box',M.wood,0,.69,-.60,1.02,.13,.48);add('box',M.dark,0,.94,-.83,1.02,.44,.13);
 for(const side of[-1,1]){add('box',color,side*.59,.60,-.30,.10,.25,1.25);add('box',M.metal,side*.61,.53,-.24,.08,.04,1.31);add('box',M.black,side*.54,1.18,-.97,.047,1.18,.05);add('box',M.black,side*.45,1.31,.66,.05,.84,.06,-.12);add('box',M.metal,side*.50,1.36,.88,.28,.025,.025,0,0,side*.25);add('box',M.metal,side*.66,1.42,.89,.10,.15,.055);add('box',M.dark,side*.46,.88,.92,.055,.56,.05,-.10);}
 add('box',M.glass,0,1.20,.93,.83,.48,.025,-.12);add('box',M.black,0,1.46,.90,.92,.04,.055);
 if(!geo.rickshawRoof){const shape=new THREE.Shape();shape.moveTo(-.65,0);shape.quadraticCurveTo(-.68,.17,-.44,.24);shape.quadraticCurveTo(0,.33,.44,.24);shape.quadraticCurveTo(.68,.17,.65,0);shape.lineTo(.60,-.035);shape.quadraticCurveTo(.42,.23,0,.23);shape.quadraticCurveTo(-.42,.23,-.60,-.035);shape.closePath();geo.rickshawRoof=new THREE.ExtrudeGeometry(shape,{depth:2.05,bevelEnabled:false,curveSegments:8});}
 add('rickshawRoof',mat('#d2af52'),0,1.64,-1.06,1,1,1);add('box',M.black,0,1.62,-1.04,1.29,.055,.07);
 add('round',M.lamp,0,.76,1.248,.13,.13,.035);for(const side of[-1,1]){add('box',M.neonRed,side*.45,.66,-1.04,.12,.09,.035);add('round',M.cream,side*.34,.82,1.21,.055,.055,.025);}
 part(root,'plane',vm(signMat('RJ 14 5072','#e5cf74','#293b35')),0,.51,1.258,.40,.13,1);
 part(root,'plane',vm(signMat('JAIPUR','#38684b','#f3dfb1')),0,.89,-1.031,.72,.20,1,0,Math.PI);
 if(rider){add('box',M.cream,0,1.10,.36,.33,.36,.23,.10);add('round',M.skin3,0,1.40,.39,.13,.15,.13);add('round',M.hair,0,1.49,.37,.14,.07,.14);for(const side of[-1,1]){add('box',M.cream,side*.20,1.09,.55,.10,.30,.10,-.8);add('box',M.dark,side*.19,.73,.43,.12,.23,.37);add('round',M.skin3,side*.20,.98,.65,.045,.055,.045);}add('box',mat('#b26764'),0,1.03,-.62,.32,.33,.22);add('round',M.skin2,0,1.32,-.61,.13,.15,.13);}
}
else if(moto){add('bevel',color,0,.65,0,.36,.3,.64);add('box',M.black,0,.85,-.25,.4,.13,.65);add('cyl',M.metal,0,.43,-.1,.17,.55,.17,Math.PI/2);for(const side of[-1,1]){add('box',M.metal,side*.14,.62,.54,.05,.85,.06,-.2);add('box',M.metal,side*.24,.98,.42,.27,.05,.05);add('box',M.dark,side*.22,.80,-.05,.13,.4,.4,-.2);}add('round',M.lamp,0,.94,.64,.15,.15,.08);if(rider){add('box',M.black,0,1.16,-.18,.38,.45,.25,.2);add('round',color,0,1.55,-.1,.17,.19,.17);add('box',M.glass,0,1.56,.04,.24,.08,.05);for(const side of[-1,1])add('box',M.black,side*.22,1.19,.12,.12,.4,.13,-.8);}}
 else if(scooter){for(const side of[-1,1]){add('box',M.metal,side*.36,1.15,.48,.025,.25,.025);add('round',M.metal,side*.36,1.29,.48,.07,.05,.025);}add('box',color,0,.55,0,.39,.52,.76);add('box',M.black,0,.84,-.2,.47,.12,.58);add('box',color,0,.65,.45,.49,.7,.16, .15);add('box',M.black,0,1.03,.49,.67,.05,.07);add('box',color,0,1.0,-.50,.42,.27,.38);add('round',M.lamp,0,.86,.57,.12,.10,.05);if(rider){add('box',M.jade,0,1.21,-.06,.36,.43,.24,.12);add('round',M.skin1,0,1.53,-.02,.14,.16,.14);add('round',M.red,0,1.64,-.035,.16,.10,.15);for(const side of[-1,1]){add('box',M.dark,side*.20,.77,.03,.12,.36,.38,0,0,side*.2);add('box',M.jade,side*.22,1.17,.20,.10,.30,.12,-.8);add('round',M.skin1,side*.22,1.06,.35,.05,.06,.05);}}}
 else{
 // Tall vehicles own their outer shell. A full-width car shell beneath it
 // would put differently colored side faces on the same depth plane.
 if(semi||rv){add('box',M.black,0,.38,0,W*.72,.20,L*.90);}
 else{add('bevel',color,0,.49,0,W,.64,L);add('box',color,0,.40,L*.40,W*.92,.27,L*.25);}
 add('box',M.black,0,.27,-L*.43,W*.78,.10,.07);if(semi){add('box',M.cream,0,1.4,-1.25,W,1.8,4.5);add('box',color,0,1.05,2.1,W,1.2,1.65);
 // The tractor hood replaces the front of the generic car shell; its
 // narrower sides cannot share a plane with the cab or trailer.
 add('box',color,0,.61,3.15,W*.92,.58,.90);
 add('box',M.glass,0,1.36,2.957,W*.87,.43,.03);
 add('box',M.metal,0,.65,3.62,W*.48,.30,.08);
 for(let i=0;i<7;i++)add('box',M.black,-.31+i*.103,.65,3.69,.03,.24,.025);
 add('box',M.metal,0,.37,3.64,W*1.05,.23,.2);for(const side of[-1,1]){add('cyl',M.metal,side*.8,1.55,1.1,.055,2.4,.055);add('box',M.metal,side*.84,.55,1.65,.1,.2,.7);}// Raised ribs stay outside the trailer instead of cutting through it.
 for(const side of[-1,1])for(let j=0;j<6;j++)add('box',M.slate,side*(W/2+.026),1.4,-3.2+j*.75,.024,.035,.035);}
 else if(rv){
 add('bevel',M.cream,0,1.18,0,W,1.65,L*.96);
 add('box',M.glass,0,1.55,L*.49,W*.88,.60,.04);
 // Separate surface trims leave a physical gap to the shell, including
 // the front/rear faces; a body-sized solid shares their end planes.
 for(const [y,h]of[[.93,.15],[1.1,.08]]){
  for(const side of[-1,1])add('box',color,side*(W/2+.026),y,0,.018,h,L*.85);
  for(const end of[-1,1])add('box',color,0,y,end*(L*.48+.026),W*.80,h,.018);
 }
 for(const side of[-1,1]){
  for(const z of[-1.1,.2])add('box',M.glass,side*(W/2+.03),1.58,z,.018,.52,.8);
  add('box',M.metal,side*(W/2+.06),1.25,1.22,.025,1.3,.63);
 }
 add('box',M.white,0,2.1,-.4,.95,.22,1);
}
 else if(pickup){add('box',M.glass,0,1.05,.42,W*.9,.65,L*.35);add('box',color,0,1.4,.42,W*.98,.14,L*.39);add('box',M.black,0,.84,-.92,W*.78,.08,L*.35);for(const side of[-1,1])add('box',color,side*W*.45,.95,-.94,.13,.38,L*.4);add('box',color,0,.95,-L*.47,W,.38,.12);add('box',M.metal,0,.37,L*.49,W*1.02,.16,.12);}
 else if(bus){add('box',M.glass,0,1.14,0,W*.97,.82,L*.87);add('box',color,0,1.62,0,W*1.02,.16,L*.98);for(const side of[-1,1])for(let i=0;i<7;i++)add('box',color,side*(W/2+.008),1.14,-L*.35+i*L*.11,.045,.84,.055);add('box',M.dark,0,1.05,L/2+.02,W*.9,.61,.04);add('box',M.blue,0,.75,L/2+.04,W*.98,.19,.06);const tm=signMat(labels.route,'#1554b9','#e7f5ff');const ds=part(root,'plane',vm(tm),0,1.48,L/2+.05,1.05,.30,1);ds.userData.routeDisplay=true;for(const side of[-1,1]){part(root,'plane',vm(signMat(labels.bus,'#e0d6b7','#275781')),side*(W/2+.035),.64,0,2.3,.34,1,0,side*Math.PI/2);}add('box',M.white,0,1.75,-.5,.85,.19,1.1);}else if(van){add('box',color,0,1.02,-.35,W*.99,1.1,L*.62);add('box',M.glass,0,.93,L*.25,W*.85,.47,L*.27);add('box',color,0,1.26,L*.25,W*.95,.12,L*.34);for(const side of[-1,1])part(root,'plane',vm(signMat(labels.delivery,'#d7ded6','#53736b')),side*(W/2+.02),1.1,-.4,1.25,.40,1,0,side*Math.PI/2);}else{add('cabin',M.glass,0,.99,-.08,W*.84,.48,L*.53);add('bevel',color,0,1.25,-.13,W*.92,.12,L*.48);add('box',color,0,.69,-.03,W*.99,.12,L*.95);for(const side of[-1,1]){add('box',color,side*W*.52,.90,.31,.17,.12,.16);add('box',M.metal,side*W*.505,.66,-.19,.03,.045,.19);}if(muscle){for(const x of[-.21,.21]){add('box',M.cream,x,.829,L*.32,.13,.02,L*.29);add('box',M.cream,x,1.317,-.13,.13,.02,L*.48);}add('box',M.metal,0,.44,L*.52,W*1.03,.10,.10);add('box',M.metal,0,.43,-L*.49,W*1.03,.11,.1);add('box',M.black,0,.7,L*.47,W*.75,.25,.05);for(const x of[-.43,-.24,.24,.43])add('round',M.lamp,x,.7,L*.5,.075,.075,.035);}
 if(type==='taxi'){add('box',M.cream,0,1.40,0,.45,.15,.25);}}
 for(const side of[-1,1]){add('box',M.lamp,side*W*.33,.55,L/2+.025,W*.17,.17,.045);add('box',M.neonRed,side*W*.33,.50,-L/2-.025,W*.17,.13,.045);}add('box',M.white,0,.35,L/2+.052,.31,.12,.02);}
 const wheelPositions=rickshaw?[[-.57,-.70],[.57,-.70],[0,.95]]:(scooter||moto)?[[0,-.60],[0,.60]]:[[-W*.50,-L*.30],[W*.50,-L*.30],[-W*.50,L*.30],[W*.50,L*.30]];
 for(const[x,z]of wheelPositions){const w=pivot(root,x,scooter?.22:.25,z);part(w,'cyl',vm(M.black),0,0,0,bus?.30:scooter?.22:.25,.13,bus?.30:scooter?.22:.25,0,0,Math.PI/2);part(w,'cyl',vm(M.metal),x<0?-.075:.075,0,0,bus?.16:.13,.02,bus?.16:.13,0,0,Math.PI/2);wheels.push(w);}
 if(semi)for(const z of[-2.5,-1.9,.55])for(const side of[-1,1]){const w=pivot(root,side*W*.5,.25,z);part(w,'cyl',vm(M.black),0,0,0,.27,.16,.27,0,0,Math.PI/2);part(w,'cyl',vm(M.metal),side*.09,0,0,.14,.02,.14,0,0,Math.PI/2);wheels.push(w);}
 const modelScale=ctx.config.traffic.modelScale??1;root.scale.setScalar(modelScale);root.position.y=.84;const setLights=enabled=>{for(const pair of lamps){pair.on.userData.agentVisible=enabled;pair.off.userData.agentVisible=!enabled;}};return{root,wheels,length:L*modelScale,width:W*modelScale,type,setLights,lamps};}


 let batchTotal=0;
 function batch(){
 const dynamicBins=new Map();
for(const p of dynamicParts){const key=p.geometry.uuid+p.material.uuid;if(!dynamicBins.has(key))dynamicBins.set(key,{parts:[],geometry:p.geometry,material:p.material});dynamicBins.get(key).parts.push(p);p.visible=false;}
for(const b of dynamicBins.values()){b.mesh=new THREE.InstancedMesh(b.geometry,b.material,b.parts.length);b.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);b.mesh.frustumCulled=false;b.mesh.castShadow=!b.material.emissive?.getHex();scene.add(b.mesh);}
const hiddenMatrix=new THREE.Matrix4().makeScale(0,0,0);
function syncDynamic(){scene.updateMatrixWorld();for(const b of dynamicBins.values()){for(let i=0;i<b.parts.length;i++){const part=b.parts[i];let visible=part.userData.agentVisible!==false;for(let p=part.parent;p&&p!==scene;p=p.parent)if(!p.visible)visible=false;b.mesh.setMatrixAt(i,visible?part.matrixWorld:hiddenMatrix);}b.mesh.instanceMatrix.needsUpdate=true;}}

 batchTotal=dynamicBins.size;return syncDynamic;
 }
 return {character,pose,car,people,trafficRoots,batch,part,pivot,batchCount:()=>batchTotal};
}
