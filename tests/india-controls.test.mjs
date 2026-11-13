import test from 'node:test';
import assert from 'node:assert/strict';
import {bindToolbar} from '../dist/assets/india-worlds/src/ui/toolbar.js';
function setup(){
 const events=new Map(),elements=new Map();
 function el(key){if(!elements.has(key))elements.set(key,{textContent:'',innerHTML:'',dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(type,fn){events.set(key+':'+type,fn)},removeEventListener(){}});return elements.get(key)}
 globalThis.window=el('window');globalThis.document={body:el('body'),querySelector:el,querySelectorAll:()=>[],addEventListener(type,fn){events.set('document:'+type,fn)},removeEventListener(){}};
 const state={timeMode:'sunset',night:false,orbit:false,paused:false,trafficMode:'active',peopleMode:'active'},ctx={state,setOrbit(value){state.orbit=value}},simulation={pendingRestoration:{},cycle(kind){state[kind+'Mode']='paused';return 'paused'}};let focused;
 const ui=bindToolbar(ctx,simulation,name=>focused=name);
 return{state,ui,get focused(){return focused},key(key,tagName='CANVAS',code=key){let prevented=false;events.get('window:keydown')({key,code,target:{tagName},preventDefault(){prevented=true}});return prevented}};
}
test('India keyboard lighting works while the 3D canvas has focus',()=>{const a=setup();a.key('1');assert.equal(a.state.timeMode,'day');a.key('3');assert.equal(a.state.timeMode,'night');assert.equal(a.state.night,true);a.ui.dispose()});
test('India shortcuts preserve native button and text-input keyboard behavior',()=>{const a=setup();for(const tag of['INPUT','TEXTAREA','BUTTON','SELECT','SUMMARY','A'])a.key('1',tag);assert.equal(a.state.timeMode,'sunset');a.ui.dispose()});
test('India canvas Space pauses and resumes; R resets the view',()=>{const a=setup();assert.equal(a.key(' ','CANVAS','Space'),true);assert.equal(a.state.paused,true);a.key(' ','CANVAS','Space');assert.equal(a.state.paused,false);a.key('r');assert.equal(a.focused,'whole');a.ui.dispose()});
