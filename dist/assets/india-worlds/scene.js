import * as T from './vendor/three/build/three.module.js';
import{LAYOUT as L}from'./layout.config.js';
import{makePath,distanceToPolyline}from'./src/world/terrain.js';
import{createIndiaArchitecture}from'./src/world/architecture-india.js';
import{buildMarket}from'./src/world/market.js';
export function buildScene(ctx){
 const{box,cyl,ball,pipe,at,geometry,transform}=ctx.batch,{mat,M}=ctx,arch=createIndiaArchitecture(ctx),{A}=arch;
 ctx.india={architecture:arch};
 // A sealed, supported miniature sandstone block. No hanging base foliage.
 box(0,-.72,0,L.width,3,L.depth,mat('#ae9782'),0,true);box(0,.62,0,68.12,.22,52.12,A.base);
 const paving=ctx.signage.textureCanvas(512,512,(c,w,h)=>{c.fillStyle='#e0c9a5';c.fillRect(0,0,w,h);for(let y=0;y<512;y+=64)for(let x=-64;x<512;x+=64){const dx=x+(y/64%2)*32;c.fillStyle=['#d9c09c','#dbc4a3','#e2cdac'][Math.floor(ctx.random()*3)];c.fillRect(dx+1,y+1,62,62);c.strokeStyle='#9b836818';c.strokeRect(dx+2,y+2,60,60);}});paving.wrapS=paving.wrapT=T.RepeatWrapping;paving.repeat.set(8,6);
 box(0,.75,0,68,.08,52,mat('#ffffff',{map:paving}));
 const stones=[mat('#b89c80'),mat('#bda185'),mat('#ac9077')];for(let row=0;row<4;row++){const y=-1.85+row*.62;for(let x=-32.8;x<33;x+=2.6)for(const z of[-26.03,26.03])box(x+(row%2)*.32,y,z,2.48,.55,.10,stones[row%3]);for(let z=-24.7;z<25;z+=2.6)for(const x of[-34.03,34.03])box(x,y,z+(row%2)*.32,.1,.55,2.48,stones[row%3]);}
 for(const s of[L.heritage,...L.north,...L.south])arch.building(s);
 // Continuous entrance threshold and a physically connected external stair to the west roof terrace.
 for(let i=0;i<3;i++)box(0,.82+i*.055,-4.58-i*.24,3.2,.09,.30,A.cream);
 for(let i=0;i<20;i++){const y=.84+(i+1)*.16,z=-5.55-i*.34;box(-14.05,(y+.815)/2,z,1.35,y-.815,.355,A.cream);}
 box(-14.75,4.08,-12.1,2.7,.16,1.2,A.cream);for(const x of[-14.7,-13.4])pipe([x,1.4,-5.55],[x,4.45,-12.0],.035,A.wood);ctx.obstacles.push({x:-14.05,z:-8.8,w:.80,d:3.8,label:'exterior stairs'});
 const market=buildMarket(ctx,arch,L);
 const{left:a,right:b,back:c,front:d,radius:r,width}=L.road,k=.55228475;
 const curve=makePath([[[a+r,d],[b-r,d]],[[b-r,d],[b-r+k*r,d],[b,d-r+k*r],[b,d-r]],[[b,d-r],[b,c+r]],[[b,c+r],[b,c+r-k*r],[b-r+k*r,c],[b-r,c]],[[b-r,c],[a+r,c]],[[a+r,c],[a+r-k*r,c],[a,c+r-k*r],[a,c+r]],[[a,c+r],[a,d-r]],[[a,d-r],[a,d-r+k*r],[a+r-k*r,d],[a+r,d]]],.815);
 // Reuse the mature ribbon helper without its USA terrain or roadside layout.
 const roadPoints=ctx.terrain.road(curve,width);ctx.terrain.crosswalk(0,d,width,2.5);
 for(const z of[d-width/2-.22,d+width/2+.22]){for(const [x,w]of[[-16,26],[16,26]])box(x,.86,z,w,.14,.28,A.cream);}
 for(const x of[a-width/2-.22,b+width/2+.22])box(x,.84,-7,.24,.10,22,A.base);
 // Drainage belongs beside the street, below the sidewalk; not a second road face.
 for(let x=-26;x<27;x+=5)for(const z of[5.9,10.1]){box(x,.825,z,.72,.025,.27,A.dark);for(let i=0;i<5;i++)box(x-.28+i*.14,.845,z,.04,.015,.26,M.metal);}
 const trafficSpawns=['rickshaw','scooter','rickshaw','car','rickshaw','scooter','rickshaw'].map((type,i)=>({type,lane:'bazaar-loop',start:(i+.3)/7,color:type==='rickshaw'?(i%2?'#457557':'#3e6a4d'):['#78918a','#b8c3b6','#c5af83'][i%3]}));
 for(const x of[-24,-21,24])ctx.obstacles.push({x,z:-3.0,w:.97,d:.41,label:'parked scooter'});
 const activities=[{x:-9,z:14.05,mode:'dining',yaw:0},{x:9,z:14.05,mode:'dining',yaw:0},{x:-10.9,z:2.1,mode:'browsing',yaw:Math.PI},{x:-18.6,z:2.25,mode:'browsing',yaw:Math.PI},{x:18.6,z:2.25,mode:'browsing',yaw:Math.PI},{x:9.8,z:2.25,mode:'browsing',yaw:Math.PI},{x:4.6,z:17.8,mode:'socializing',yaw:-1.2},{x:5.6,z:17.1,mode:'socializing',yaw:-2.9},{x:-4.0,z:17.9,mode:'socializing',yaw:1.1},{x:-3.0,z:18.4,mode:'taking-photo',yaw:-1.0}];
 return{buildings:arch.buildings,roadPoints,roadWidth:width,lanes:[{id:'bazaar-loop',entry:'bazaar-loop',axis:'LOOP',closed:true,curve,stopPoint:[-3.5,d],exitDistance:8,speed:2.6}],junction:{x:0,z:d,w:3.2,d:2.1},footRoutes:L.footRoutes,crossings:[L.crossing],activities,signals:[{x:-3.5,z:5.3,axis:'LOOP',rotation:Math.PI/2}],trafficSpawns,
 parked:[{type:'scooter',x:-24,z:-3.0,yaw:Math.PI/2,color:'#6d8b7a'},{type:'scooter',x:-21,z:-3.0,yaw:Math.PI/2,color:'#a86550'},{type:'scooter',x:24,z:-3.0,yaw:-Math.PI/2,color:'#d5b65a'}],groundHeight:(x,z)=>distanceToPolyline(x,z,roadPoints)<width/2?.815:.79,
 metrics:()=>({...arch.metrics,...market.metrics}),update:market.update,dispose(){arch.dispose();market.dispose();paving.dispose();}};
}
