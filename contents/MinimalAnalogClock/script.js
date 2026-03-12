import * as THREE from 'https://esm.sh/three@0.160.0';
import { OrbitControls } from 'https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'https://esm.sh/three@0.160.0/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RGBELoader } from 'https://esm.sh/three@0.160.0/examples/jsm/loaders/RGBELoader.js';

const ANIMATION_DURATION = 2400 * 5; // ms for click animation

const COLOR_LIST = [
  0xff0000,0xff7f00,0xffff00,0x7fff00,0x00ff00,0x00ff7f,0x00ffff,0x007fff,
  0x0000ff,0x7f00ff,0xff00ff,0xff007f,0xff1493,0xff4500,0xff6347,0xff8c00,
  0xff69b4,0xffb6c1,0xffc0cb,0xffdab9,0xffefd5,0xfff000,0xfff500,0xfff700,
  0xfffa00,0xffff00,0xfffe00,0xffff0f,0xffff3f,0xffff7f,0xffffbf,0xffffff,
  0x00ff7f,0x00ffbf,0x00ffff,0x00bfff,0x007fff,0x0000ff,0x3f00ff,0x7f00ff,
  0xbf00ff,0xff00ff,0xff00bf,0xff007f,0xff0040,0xff001f,0xff000f,0xff0005,
  0xff8000,0xff4000,0xff2000,0xff1000,0xff0800,0xff0400,0xff0200,0xff0100,
  0xff0000,0xff3300,0xff6600,0xff9900,0xffcc00,0xffff00,0xccff00,0x99ff00,
  0x66ff00,0x33ff00,0x00ff00,0x00ff33,0x00ff66,0x00ff99,0x00ffcc,0x00ffff,
  0x00ccff,0x0099ff,0x0066ff,0x0033ff,0x0000ff,0x3300ff,0x6600ff,0x9900ff
];

function shuffle(array){let i=array.length,t,m;while(i){t=Math.floor(Math.random()*i--);m=array[i];array[i]=array[t];array[t]=m;}return array;}
const COLOR_PALETTE = shuffle([...COLOR_LIST]);

const container = document.getElementById('scene-container');
const timeDisplay = document.getElementById('digital-time');
const dateDisplay = document.getElementById('digital-date');
const nextColorInput = document.getElementById('next-color-input');

const palette = COLOR_PALETTE.map(hex=>new THREE.Color(hex));
let currentPaletteIndex = 0;

const scene = new THREE.Scene();
scene.background = new THREE.Color(palette[currentPaletteIndex]);
const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(-6,3,14);

const renderer = new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NoToneMapping;
container.appendChild(renderer.domElement);

new RGBELoader()
.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr', tex=>{
  tex.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = tex;
  scene.environmentIntensity = 0.8;
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 25;

scene.add(new THREE.AmbientLight(0xffffff,1));
const mainLight = new THREE.DirectionalLight(0xffffff,1);
mainLight.position.set(5,10,8);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048,2048);
scene.add(mainLight);
const rimLight = new THREE.DirectionalLight(0xffffff,0.5);
rimLight.position.set(-10,0,-5);
scene.add(rimLight);

const dynamicMaterial = new THREE.MeshPhysicalMaterial({color:palette[currentPaletteIndex], roughness:0.2, metalness:0, clearcoat:0.5, clearcoatRoughness:0.1, reflectivity:0.5});
const darkMaterial = new THREE.MeshStandardMaterial({color:0x222222,roughness:0.4});

const clockGroup = new THREE.Group();
scene.add(clockGroup);

const body = new THREE.Mesh(new RoundedBoxGeometry(6.5,6.5,2.2,4,0.15), dynamicMaterial);
body.castShadow=true;body.receiveShadow=true;clockGroup.add(body);

const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.6,0.6,0.2,32), dynamicMaterial);
btn.position.y=3.35; clockGroup.add(btn);

function createFaceTexture(){
  const cvs=document.createElement('canvas');
  cvs.width=cvs.height=1024;
  const ctx=cvs.getContext('2d');
  ctx.fillStyle='#e5e5e5';
  ctx.fillRect(0,0,1024,1024);
  ctx.translate(512,512);
  ctx.fillStyle='#111';
  for(let i=0;i<60;i++){
    const isHour=i%5===0;
    const w=isHour?14:5;
    const h=isHour?50:20;
    ctx.save();
    ctx.rotate(i*6*Math.PI/180);
    ctx.translate(0,-512+20);
    ctx.fillRect(-w/2,0,w,h);
    ctx.restore();
  }
  return new THREE.CanvasTexture(cvs);
}

const face = new THREE.Mesh(
  new THREE.CylinderGeometry(2.9,2.9,0.1,64).rotateX(Math.PI/2),
  new THREE.MeshPhysicalMaterial({map:createFaceTexture(), roughness:0.2, metalness:0, clearcoat:0.3})
);
face.position.z=1.11; clockGroup.add(face);

function createHand(w,l,mat,z){
  const g=new THREE.Group();
  const geo=new THREE.BoxGeometry(w,l,0.06);
  geo.translate(0,l/2-w,0);
  const m=new THREE.Mesh(geo,mat);
  m.castShadow=true; g.add(m); g.position.z=z;
  clockGroup.add(g); return g;
}

const hourHand=createHand(0.22,1.8,darkMaterial,1.2);
const minHand=createHand(0.15,2.6,darkMaterial,1.25);
const secHandGroup=new THREE.Group();
const secMesh=new THREE.Mesh(new THREE.BoxGeometry(0.06,3.2,0.04).translate(0,1,0),dynamicMaterial);
secMesh.castShadow=true; secHandGroup.add(secMesh); secHandGroup.position.z=1.3; clockGroup.add(secHandGroup);
clockGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12,0.12,0.1,16).rotateX(Math.PI/2).translate(0,0,1.35),darkMaterial));
clockGroup.rotation.set(-0.1,-0.5,0);

const pad=n=>n.toString().padStart(2,'0');
const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];

let animationStartTime=null;
let animationActive=false;
let animationFrom=new Date();
let animationTo=new Date();

function startDayAnimation(){
  animationFrom=new Date();
  animationTo=new Date(animationFrom.getTime()+24*60*60*1000);
  animationStartTime=performance.now();
  animationActive=true;
}

container.addEventListener('click',startDayAnimation);

function updateClock(now){
  let h=now.getHours();
  const m=now.getMinutes();
  const s=now.getSeconds();
  const ms=now.getMilliseconds();
  const sDeg=-((s+ms/1000)/60)*Math.PI*2;
  const mDeg=-((m+s/60)/60)*Math.PI*2;
  const hDeg=-((h%12+m/60)/12)*Math.PI*2;
  secHandGroup.rotation.z=sDeg;
  minHand.rotation.z=mDeg;
  hourHand.rotation.z=hDeg;
  const ampm=h>=12?'PM':'AM';
  h=h%12; h=h?h:12;
  timeDisplay.textContent=`${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;
  const dayName=days[now.getDay()];
  const monthName=months[now.getMonth()];
  const dayNum=now.getDate();
  dateDisplay.textContent=`${dayName}, ${monthName} ${dayNum}`;
}

function animate(time){
  requestAnimationFrame(animate);
  let now=new Date();
  if(animationActive){
    const t=(time-animationStartTime)/ANIMATION_DURATION;
    if(t>=1){animationActive=false; now=animationFrom;} 
    else{
      const progress=t;
      now=new Date(animationFrom.getTime() + progress*(animationTo.getTime()-animationFrom.getTime()));
    }
  }
  updateClock(now);

  const totalMins=now.getHours()*60+now.getMinutes();
  const idx=Math.floor(totalMins/15)%palette.length;
  if(!animationActive){
    dynamicMaterial.color.copy(palette[idx]);
    const bgColor=dynamicMaterial.color.clone().offsetHSL(0.5,0,-0.2);
    scene.background.copy(bgColor);
    container.style.backgroundColor='#'+bgColor.getHexString();
    document.documentElement.style.setProperty('--dynamic-color','#'+dynamicMaterial.color.getHexString());
  }

  controls.update();
  renderer.render(scene,camera);
}

window.addEventListener('resize',()=>{
  camera.aspect=container.clientWidth/container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth,container.clientHeight);
});

animate();
