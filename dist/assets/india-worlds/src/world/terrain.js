import * as THREE from '../../vendor/three/build/three.module.js';
// USA road/path implementation, with base construction owned by the India scene.
export function createTerrain(ctx){const{M}=ctx,{box}=ctx.batch;
 function road(path,width=3.2){
  const positions=[],uv=[],n=Math.ceil(path.getLength()*3),points=[];
  for(let i=0;i<=n;i++){const u=i/n,p=path.getPointAt(u),t=path.getTangentAt(u),nx=-t.z,nz=t.x;points.push(p);for(const side of[-1,1]){positions.push(p.x+nx*width/2*side,.815,p.z+nz*width/2*side);uv.push(u,side===1?1:0);}}
  const idx=[];for(let i=0;i<n;i++){const a=i*2;idx.push(a,a+2,a+1,a+1,a+2,a+3);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const m=new THREE.MeshStandardMaterial({color:'#827f72',roughness:ctx.config.weather.preset==='rain'?.35:.8,metalness:.02,side:THREE.DoubleSide});const mesh=new THREE.Mesh(g,m);mesh.receiveShadow=true;ctx.scene.add(mesh);
  return points.map(p=>[p.x,p.z]);
 }
 function crosswalk(x,z,length=3.1,width=2.4,rotation=0){ctx.batch.at(x,0,z,rotation,()=>{const count=6,stripe=width/(count*2-1);for(let i=0;i<count;i++)box(-width/2+stripe/2+i*stripe*2,.835,0,stripe,.018,length,M.white);});}
return {road,crosswalk};}
export function makePath(segments,y=.84){
 const curve=new THREE.CurvePath(),v=p=>new THREE.Vector3(p[0],y,p[1]);
 for(const s of segments){if(s.length===2)curve.add(new THREE.LineCurve3(v(s[0]),v(s[1])));else if(s.length===4)curve.add(new THREE.CubicBezierCurve3(...s.map(v)));else throw new Error('Path segments require 2 line points or 4 cubic control points');}
 return curve;
}
export function distanceToPolyline(x,z,points){let distance=Infinity;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));distance=Math.min(distance,Math.hypot(x-a[0]-u*dx,z-a[1]-u*dz));}return distance;}
