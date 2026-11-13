// All dimensions in world units. +Z is the front. Ground/road=.815; actor roots=.84.
export const LAYOUT={
 width:68,depth:52,ground:.815,
 heritage:{id:'gulabi-haveli',x:0,z:-10.9,w:22,d:10.2,floors:3,hero:true,shops:['crafts','jewelry','textiles','tea','sweets','spices','clothing']},
 north:[{id:'west-textiles',x:-24.15,z:-10.2,w:5.7,d:10.7,floors:2,veranda:true,shops:['textiles','clothing']},{id:'west-chai-house',x:-18.25,z:-10.2,w:6.1,d:10.7,floors:3,shops:['tea','spices']},{id:'east-jewelry',x:17.75,z:-10.2,w:5.1,d:10.7,floors:2,veranda:true,shops:['jewelry','sweets']},{id:'east-craft-house',x:23.65,z:-10.2,w:6.7,d:10.7,floors:3,shops:['crafts','textiles']}],
 south:[{id:'west-residential',x:-25.75,z:19,w:8.5,d:9,floors:2,rotation:Math.PI,shops:['clothing','textiles']},{id:'west-corner-home',x:-18.75,z:18.5,w:5.5,d:8,floors:1,rotation:Math.PI,shops:['tea','sweets']},{id:'east-residential',x:25.75,z:19,w:8.5,d:9,floors:2,rotation:Math.PI,shops:['sweets','crafts']},{id:'east-corner-home',x:18.75,z:18.5,w:5.5,d:8,floors:1,rotation:Math.PI,shops:['spices','jewelry']}],
 road:{left:-30,right:30,back:-21,front:8,radius:4,width:3.8},
 stalls:[{x:-19,z:.7,kind:'textiles'},{x:-10,z:.7,kind:'tea'},{x:10,z:.7,kind:'spices'},{x:19,z:.7,kind:'crafts'}],
 footRoutes:[[[-25,3.9],[25,3.9],[25,-2.3],[-25,-2.3]],[[-13.5,12],[13.5,12],[13.5,23],[-13.5,23]]],
 crossing:{a:[0,4.7],b:[0,11.4]},
 presets:{whole:{position:[39,46,72],target:[0,3.6,-1],zoom:1},haveli:{position:[25,28,53],target:[0,8,-6.3],zoom:1.9},bazaar:{position:[-37,27,48],target:[-15,2.5,-1],zoom:2},courtyard:{position:[30,30,52],target:[3,2.5,15],zoom:1.65}}
};
