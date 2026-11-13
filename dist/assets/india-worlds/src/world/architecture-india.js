import * as T from '../../vendor/three/build/three.module.js';
/** Original Jaipur-inspired construction; reused geometry/material batching is the USA foundation. */
export function createIndiaArchitecture(ctx){
 const{box,cyl,ball,pipe,at,geometry,transform}=ctx.batch,{mat,M}=ctx,cache=new Map(),buildings=[],metrics={arches:0,jharokhas:0,chhatris:0,stockedShops:0};
 const skin=ctx.signage.textureCanvas(256,256,(c,w,h)=>{c.fillStyle='#f5eee5';c.fillRect(0,0,w,h);for(let i=0;i<2200;i++){c.fillStyle=i%2?'#6b4a3d0a':'#fff9ed16';c.fillRect(ctx.rr(0,w),ctx.rr(0,h),ctx.rr(.4,2),ctx.rr(.4,3));}for(let i=0;i<7;i++){c.fillStyle='#8d685309';c.fillRect(ctx.rr(0,w),ctx.rr(0,h),ctx.rr(4,18),ctx.rr(4,14));}});
 const A={pink:mat('#c68470',{map:skin}),rose:mat('#d6a18b',{map:skin}),terracotta:mat('#b77862',{map:skin}),cream:mat('#e9d6b6'),ivory:mat('#f0e1c7'),base:mat('#ac8168'),wood:mat('#594438'),woodLight:mat('#917052'),jade:mat('#345e59'),indigo:mat('#3d596d'),gold:mat('#b08e52'),dark:mat('#393a34'),glow:mat('#d5ba88',{emissive:'#ffd49a',emissiveIntensity:1.1}),clay:mat('#ab6349')};
 const shopInterior=mat('#a98d72',{emissive:'#f4bd7f',emissiveIntensity:.43});
 const fabrics=[A.indigo,A.jade,mat('#b96556'),mat('#c8a65c'),mat('#c4b4a0')];
 const spec={textiles:['कपड़े','TEXTILES'],crafts:['हस्तशिल्प','HANDICRAFTS'],jewelry:['आभूषण','JEWELLERY'],tea:['चाय','CHAI & COMPANY'],sweets:['मिठाई','SWEETS'],spices:['मसाले','SPICES'],clothing:['पोशाक','CLOTHING']};
 const memo=(key,fn)=>{if(!cache.has(key))cache.set(key,fn());return cache.get(key)};
 function arch(w,h){const p=new T.Shape();p.moveTo(-w/2,0);p.lineTo(w/2,0);p.lineTo(w/2,h*.62);p.bezierCurveTo(w*.5,h*.73,w*.35,h*.74,w*.34,h*.80);p.bezierCurveTo(w*.31,h*.89,w*.16,h*.83,0,h);p.bezierCurveTo(-w*.16,h*.83,-w*.31,h*.89,-w*.34,h*.80);p.bezierCurveTo(-w*.35,h*.74,-w*.5,h*.73,-w/2,h*.62);p.closePath();return p;}
 function hole(shape,inner,dy){const pts=inner.getPoints(32).map(p=>new T.Vector2(p.x,p.y+dy));shape.holes.push(new T.Path(pts.reverse()));return shape;}
 function extrude(sh,d){return new T.ExtrudeGeometry(sh,{depth:d,bevelEnabled:false,curveSegments:8});}
 function frame(x,y,z,w,h,t=.08,m=A.cream,depth=.07){const g=memo(`arch:${w}:${h}:${t}:${depth}`,()=>extrude(hole(arch(w,h),arch(w-2*t,h-2*t),t),depth));geometry(g,m,transform(x,y,z));metrics.arches++;}
 function opening(x,y,z,w,h,iw,ih,m=A.pink){const g=memo(`wall:${w}:${h}:${iw}:${ih}`,()=>{const sh=new T.Shape();sh.moveTo(-w/2,0);sh.lineTo(w/2,0);sh.lineTo(w/2,h);sh.lineTo(-w/2,h);sh.closePath();return extrude(hole(sh,arch(iw,ih),.14),.3)});geometry(g,m,transform(x,y,z));frame(x,y+.10,z+.325,iw+.12,ih+.10,.07);}
 function grille(x,y,z,w,h){for(let i=0;i<=6;i++)box(x-w/2+i*w/6,y+h/2,z,.026,h,.035,A.cream);for(let j=0;j<=6;j++)box(x,y+j*h/6,z,w,.026,.035,A.cream);for(let i=0;i<4;i++)for(let j=0;j<4;j++){const mx=x-w*.38+i*w*.25,my=y+h*.13+j*h*.24;box(mx,my,z+.025,.048,.048,.045,A.cream,Math.PI/4);}}
 function balustrade(x,y,z,w){box(x,y+.47,z,w+.08,.09,.18,A.cream);box(x,y+.02,z,w,.10,.19,A.cream);for(let i=0;i<=Math.floor(w/.38);i++){let xx=x-w/2+i*w/Math.floor(w/.38);cyl(xx,y+.24,z,.035,.40,A.ivory);cyl(xx,y+.27,z,.058,.09,A.cream);}}
 function jharokha(x,y,z,w=1.5,h=2.25,room=A.dark){metrics.jharokhas++;const d=.83;
  box(x,y+.02,z+.3,w+.27,.17,1.15,A.cream);box(x,y-.12,z+.20,w+.06,.12,.90,A.base);
  for(const side of[-1,1]){const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(.65,0);sh.quadraticCurveTo(.48,-.34,0,-.57);sh.closePath();const g=memo('bracket',()=>extrude(sh,.10));geometry(g,A.base,transform(x+side*w*.32,y-.15,z-.11,1,1,1,0,-Math.PI/2));box(x+side*w*.46,y+h*.47,z+.31,.10,h*.88,1.03,A.rose);cyl(x+side*w*.43,y+h*.44,z+.86,.048,h*.84,A.cream);}
  frame(x,y+.19,z+.85,w*.83,h*.82,.065,A.cream,.08);box(x,y+h*.45,z-.01,w*.73,h*.68,.06,room);grille(x,y+.28,z+.30,w*.69,h*.54);box(x,y+h+.04,z+.3,w+.47,.15,1.24,A.cream);box(x,y+h+.17,z+.28,w+.27,.11,1.08,A.terracotta);balustrade(x,y+.12,z+.91,w*.83);
  for(const side of[-1,1]){box(x+side*w*.22,y+h*.88,z+.94,.042,.13,.05,A.gold);}
 }
 function chhatri(x,y,z,r=1.35){metrics.chhatris++;cyl(x,y+.08,z,r*1.16,.16,A.cream);for(let k=0;k<8;k++){const a=k*Math.PI/4,px=x+Math.cos(a)*r*.82,pz=z+Math.sin(a)*r*.82;cyl(px,y+1.07,pz,.066,1.92,A.rose);cyl(px,y+.23,pz,.12,.16,A.cream);cyl(px,y+1.98,pz,.13,.13,A.cream);at(x,y+1.42,z,-a-Math.PI/8+Math.PI/2,()=>frame(0,0,r*.77,r*.62,.65,.045,A.cream,.07));}
  ball(x,y+1.98,z,.09,.12,.09,A.glow);cyl(x,y+2.1,z,r*1.23,.16,A.cream);const g=memo('dome:'+r,()=>new T.LatheGeometry([[0,0],[r*1.22,0],[r*1.23,.09],[r*1.08,.18],[r*.94,.29],[r*.87,.56],[r*.62,.92],[r*.28,1.12],[0,1.2]].map(p=>new T.Vector2(...p)),24));geometry(g,A.terracotta,transform(x,y+2.19,z));cyl(x,y+3.46,z,.045,.29,A.gold);ball(x,y+3.64,z,.075,.10,.075,A.gold);
 }
 function stock(kind,x,y,z,w=2.1){metrics.stockedShops++;box(x,y+.67,z,w,.10,.72,A.wood);for(const dx of[-w*.4,w*.4])box(x+dx,y+.31,z,.10,.61,.6,A.wood);box(x,y+.55,z-.86,w,.1,.45,A.woodLight);box(x,y+1.17,z-.86,w,.1,.45,A.woodLight);box(x,y+1.80,z-.86,w,.1,.45,A.woodLight);
  if(['textiles','clothing'].includes(kind)){for(let i=0;i<4;i++)for(let j=0;j<3;j++){box(x-w*.35+i*w*.23,y+.75+j*.18,z-.06,.39,.15,.56,fabrics[(i+j)%5]);box(x-w*.35+i*w*.23,y+.79+j*.18,z+.229,.34,.015,.009,A.cream);}for(let j=0;j<3;j++)for(let k=0;k<4;k++)box(x-w*.36+k*w*.23,y+.67+j*.62,z-.86,.4,.17,.4,fabrics[(j*2+k)%5]);for(let i=0;i<3;i++){pipe([x-.72+i*.7,y+2.6,z-.4],[x-.72+i*.7,y+1.15,z-.4],.12,fabrics[i]);}}
  else if(kind==='tea'){cyl(x-.4,y+1.06,z,.26,.55,M.metal);cyl(x-.4,y+1.36,z,.29,.06,M.metal);ball(x-.4,y+1.43,z,.06,.06,.06,A.dark);pipe([x-.19,y+1.12,z],[x+.1,y+1.27,z],.044,M.metal);for(let k=0;k<6;k++){cyl(x+.25+(k%3)*.22,y+.87,z-.16+Math.floor(k/3)*.31,.07,.18,A.clay);}box(x+.55,y+.83,z+.03,.85,.05,.60,M.metal);for(let i=0;i<3;i++)cyl(x-.65+i*.55,y+1.44,z-.85,.13,.37,A.cream);}
  else if(kind==='sweets'){for(let i=0;i<3;i++){box(x-.68+i*.67,y+.76,z,.59,.035,.60,M.metal);for(let k=0;k<6;k++)ball(x-.84+i*.67+(k%2)*.23,y+.84,z-.19+Math.floor(k/2)*.19,.085,.07,.085,i%2?M.orange:mat('#c49a55'));}for(let j=0;j<2;j++)for(let i=0;i<3;i++)cyl(x-.67+i*.67,y+.76+j*.63,z-.87,.23,.16,A.clay);}
  else if(kind==='spices'){for(let j=0;j<2;j++)for(let i=0;i<4;i++){cyl(x-.78+i*.50,y+.82+j*.61,z-.68,.19,.30,A.clay);ball(x-.78+i*.50,y+1.0+j*.61,z-.68,.16,.10,.16,[M.orange,A.terracotta,A.cream,A.gold][i]);}for(let i=0;i<4;i++)cyl(x-.75+i*.5,y+.81,z+.02,.19,.19,A.woodLight);}
  else{for(let j=0;j<3;j++)for(let i=0;i<4;i++){const xx=x-.76+i*.5,yy=y+.75+j*.62;if(kind==='jewelry'){geometry(memo('bangle',()=>new T.TorusGeometry(.13,.025,5,12)),A.gold,transform(xx,yy+.15,z-.82,1,1,1,Math.PI/2));}else{cyl(xx,yy+.15,z-.82,.12,.31,A.gold);ball(xx,yy+.33,z-.82,.08,.1,.08,A.gold);}}}
 }
 function roofTerrace(w,d,y,hero){for(const zz of[-d/2+.12,d/2-.12]){box(0,y+.2,zz,w,.35,.22,A.rose);balustrade(0,y+.37,zz,w-.25);}for(const xx of[-w/2+.12,w/2-.12])at(xx,y+.37,0,Math.PI/2,()=>balustrade(0,0,0,d-.5));box(w*.30,y+.12,-d*.22,1.35,.16,1.4,A.cream);cyl(w*.3,y+.66,-d*.22,.5,1,M.dark);cyl(w*.3,y+1.2,-d*.22,.54,.1,M.iron);for(const dx of[-.34,.34])pipe([w*.30+dx,y+.16,-d*.22],[w*.3+dx,y+.23,-d*.22],.035,M.iron);
  if(!hero){pipe([-w*.30,y+1.5,-d*.20],[w*.10,y+1.5,-d*.20],.016,M.iron);for(let i=0;i<4;i++)box(-w*.24+i*.51,y+1.1,-d*.2,.4,.65,.035,fabrics[i]);for(const xx of[-w*.35,-w*.2]){cyl(xx,y+.18,d*.18,.19,.34,A.clay);ball(xx,y+.49,d*.18,.24,.31,.24,M.leaf);}}
 }
 function roomFor(id,floor,bay){let h=2166136261;for(const c of id+':'+floor+':'+bay)h=Math.imul(h^c.charCodeAt(0),16777619);return ((h>>>0)%100)<72?M.warmDim:A.dark;}
 function building(s){const base=.9,fh=3.2,H=s.floors*fh,front=s.d/2;buildings.push({...s,height:H+(s.hero?7.1:1.8)});ctx.obstacles.push({x:s.x,z:s.z,w:s.w/2+.18,d:s.d/2+1.15,label:s.id});at(s.x,base,s.z,s.rotation??0,()=>{
  box(0,-.04,0,s.w+.25,.20,s.d+.25,A.base);box(0,H/2,-s.d/2+.15,s.w,H,.30,A.pink);for(const side of[-1,1]){if(s.id==='west-chai-house'&&side===1){const xx=s.w/2-.15;box(xx,1.6,0,.30,3.2,s.d,A.rose);box(xx,(5.8+H)/2,0,.30,H-5.8,s.d,A.rose);for(const [zz,len]of[[-3.925,2.85],[2.025,6.65]])box(xx,4.5,zz,.30,2.6,len,A.rose);at(s.w/2+.03,3.2,-1.9,Math.PI/2,()=>frame(0,0,0,1.21,2.68,.08,A.cream,.10));}else box(side*(s.w/2-.15),H/2,0,.30,H,s.d,A.rose);}
  const count=s.shops.length,pitch=s.w/count;
  for(let floor=0;floor<s.floors;floor++){const y=floor*fh;box(0,y-.02,0,s.w,.18,s.d,A.cream);box(0,y+fh-.08,front+.1,s.w+.35,.16,.58,A.cream);box(0,y+fh-.30,front+.02,s.w,.09,.28,A.base);
   for(let k=0;k<count;k++){const x=-s.w/2+pitch*(k+.5);if(floor===0){opening(x,y,front-.3,pitch,fh,pitch*.74,2.65,s.hero?A.pink:A.terracotta);box(x,y+2.62,front-1.0,pitch*.45,.035,.18,A.glow);if(!(s.hero&&k===3)){box(x,y+1.38,front-3.0,pitch-.28,2.70,.13,shopInterior);for(const side of[-1,1])box(x+side*(pitch/2-.10),y+1.4,front-1.65,.12,2.8,2.75,A.rose);stock(s.shops[k],x,y,front-1.65,Math.min(2.7,pitch*.78));}for(let strip=0;strip<10;strip++)box(x-pitch*.38+(strip+.5)*pitch*.076,y+2.58,front+.55,pitch*.076-.006,.055,.84,strip%2?A.cream:fabrics[k%5],0);ctx.signage.sign(s.hero&&k===3?'प्रवेश':spec[s.shops[k]][0],x,y+2.92,front+.26,pitch*.79,.4,'#e4cbaa','#56453d',0,false,s.hero&&k===3?'ENTRANCE':spec[s.shops[k]][1]);}
    else if(s.veranda&&floor===s.floors-1){opening(x,y,front-.3,pitch,fh,pitch*.77,2.55,A.rose);box(x,y+.02,front+.37,pitch+.05,.15,1.28,A.cream);balustrade(x,y+.16,front+.95,pitch-.12);for(const side of[-1,1]){cyl(x+side*pitch*.42,y+1.48,front+.84,.055,2.6,A.cream);}box(x,y+2.91,front+.53,pitch+.13,.13,1.55,A.cream);}
    else{opening(x,y,front-.3,pitch,fh,1.0,2.45,A.pink);jharokha(x,y+.22,front+.05,Math.min(1.65,pitch*.67),2.32,roomFor(s.id,floor,k));}
   }
   for(const side of[-1,1])at(side*s.w/2,y,0,side*Math.PI/2,()=>{for(let k=0;k<3;k++){const x=-s.d*.32+k*s.d*.32;box(x,1.5,-.055,.88,1.65,.035,roomFor(s.id,floor,k===2?(side<0?0:count-1):k));frame(x,.65,.04,1.04,1.95,.07);box(x-.59,1.5,.1,.20,1.7,.10,A.jade);box(x+.59,1.5,.1,.20,1.7,.10,A.jade);}box(0,fh-.08,.10,s.d,.14,.45,A.cream);});
   at(0,y,-s.d/2-.05,Math.PI,()=>{for(let k=0;k<count;k++){const x=-s.w/2+pitch*(k+.5);box(x,1.5,0,.94,1.65,.06,roomFor(s.id,floor,k));frame(x,.59,.08,1.10,2.0,.06);box(x,1.38,.15,.06,1.48,.05,A.cream);box(x,.54,.15,1.25,.10,.33,A.cream);}});
  }
  box(0,H,0,s.w+.4,.24,s.d+.4,A.cream);roofTerrace(s.w,s.d,H+.12,s.hero);
  if(s.hero){for(const xx of[-s.w*.40,s.w*.40])chhatri(xx,H+.2,0,1.18);box(0,H+1.34,-.8,9.6,2.6,5.7,A.pink);for(let k=0;k<5;k++){const x=-3.8+k*1.9;box(x,H+1.3,2.085,.84,1.48,.04,k%2?A.dark:M.warmDim);frame(x,H+.47,2.15,1.09,1.94,.06);}box(0,H+2.74,-.8,10.1,.2,6.1,A.cream);chhatri(0,H+2.86,-.8,1.45);ctx.signage.sign('गुलाबी हवेली',0,H+2.13,2.27,5.2,.43,'#e4cbaa','#594438',0,false,'GULABI HAVELI');
   // Real entrance portal, open arch with a visible corridor and successive door frames.
   const iy=0;frame(0,iy+.06,front+.6,3.1,3.0,.12,A.cream,.16);for(const zz of[front-.7,front-2.0])frame(0,.09,zz,2.55,2.8,.10,A.cream,.12);
  }
 });return s;}
 return{A,fabrics,spec,buildings,metrics,frame,opening,jharokha,chhatri,balustrade,stock,building,dispose:()=>{cache.forEach(g=>g.dispose());skin.dispose();}};
}
