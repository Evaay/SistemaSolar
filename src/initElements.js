import * as THREE from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

//mercury textures
const mercm = new THREE.TextureLoader().load("public/textures/mercury/mercurymap.jpg");
const mercb = new THREE.TextureLoader().load("public/textures/mercury/mercurybump.jpg");

//venus textures
const venm = new THREE.TextureLoader().load("public/textures/venus/venusmap.jpg");
const venb = new THREE.TextureLoader().load("public/textures/venus/venusbump.jpg");

//earth textures
const tx1 = new THREE.TextureLoader().load("public/textures/earth/earthmap1k.jpg");
const txb1 = new THREE.TextureLoader().load("public/textures/earth/earthbump1k.jpg");
const txspec1 = new THREE.TextureLoader().load("public/textures/earth/earthspec1k.jpg");
//Capa de nubes
const tx2 = new THREE.TextureLoader().load("public/textures/earth/earthcloudmap.jpg");
const txalpha2 = new THREE.TextureLoader().load("public/textures/earth/earthcloudmaptrans_invert.jpg");
const earthnight = new THREE.TextureLoader().load("public/textures/earth/image (11).png");

//moon textures
const moonm = new THREE.TextureLoader().load("public/textures/moon/moonmap1k.jpg");
const moonb = new THREE.TextureLoader().load("public/textures/moon/moonbump1k.jpg");

//mars textures
const marsm = new THREE.TextureLoader().load("public/textures/mars/mars_1k_color.jpg");
const marsn = new THREE.TextureLoader().load("public/textures/mars/mars_1k_normal.jpg");
const phobosb = new THREE.TextureLoader().load("public/textures/mars/phobosbump.jpg");
const deimosb = new THREE.TextureLoader().load("public/textures/mars/deimosbump.jpg");

//jupiter textures
const jupm = new THREE.TextureLoader().load("public/textures/jupiter/jupitermap.jpg");

//saturn textures
const satm = new THREE.TextureLoader().load("public/textures/saturn/saturnmap.jpg");
const sarturnringm = new THREE.TextureLoader().load("public/textures/saturn/saturnringcolor.jpg");
const sarturnringt = new THREE.TextureLoader().load("public/textures/saturn/saturnringpattern.gif");

//uranus textures
const uram = new THREE.TextureLoader().load("public/textures/uranus/uranusmap.jpg");
const uranringm = new THREE.TextureLoader().load("public/textures/uranus/uranusringcolour.jpg");
const uranringt = new THREE.TextureLoader().load("public/textures/uranus/uranusringtrans.gif");

//neptune textures
const nepm = new THREE.TextureLoader().load("public/textures/neptune/neptunemap.jpg");

let materialArray = [mercm, venm, tx1, marsm, jupm, satm, uram, nepm];

//sun texture
let sun;
let sunTexture = new THREE.TextureLoader().load("public/textures/sun.jpg");
export { sun, materialArray };

const rotationValue = Math.PI / 180;

export function initElements(Planetas, Lunas, scene, Asteroides) {
// Sol
sun = Sun(scene, 1.8, 0xffffff, sunTexture);

// Mercurio
Planeta("Mercurio", Planetas, scene, scene, 0.25, -4.0, -1.25, 0xffffff, 1.0, 1.0, 0.005, mercm, undefined);
Planetas[0].userData.mass = "3.285 × 10²³ kg";
Planetas[0].userData.diameter = "4,879 km";
Planetas[0].userData.gravity = "3.7 m/s²";

// Venus
Planeta("Venus", Planetas, scene, scene, 0.45, -7.0, 0.7, 0xffffff, 1.0, 1.0, -0.002, venm, undefined);
Planetas[1].rotation.z = 173.3 * rotationValue;
Planetas[1].userData.mass = "4.867 × 10²⁴ kg";
Planetas[1].userData.diameter = "12,104 km";
Planetas[1].userData.gravity = "8.87 m/s²";

// Tierra
Planeta("Tierra", Planetas, scene, scene, 0.5, -10.0, -0.5, 0xffffff, 1.0, 1.0, 0.02, tx1, txb1, txspec1, undefined, true, earthnight);
Planetas[2].rotation.z = -23.4 * rotationValue;
Planetas[2].userData.mass = "5.972 × 10²⁴ kg";
Planetas[2].userData.diameter = "12,742 km";
Planetas[2].userData.gravity = "9.807 m/s²";
Planeta("", Planetas, scene, Planetas[2], 0.51, -10.0, -0.5, 0xffffff, 1.0, 1.0, -0.005, tx2, undefined, undefined, txalpha2, true);
// Luna
Luna(Lunas, Planetas[2], 0.15, 1.0, -Math.PI /2, 0xffffff, 0.2, moonm, moonb);

// Marte
Planeta("Marte", Planetas, scene, scene, 0.35, -13.0, -0.4, 0xffffff, 1.0, 1.0, 0.019, marsm, marsn, undefined, undefined, true);
Planetas[4].rotation.z = -25.9 * rotationValue;
Planetas[4].userData.mass = "6.39 × 10²³ kg";
Planetas[4].userData.diameter = "6,779 km";
Planetas[4].userData.gravity = "3.721 m/s²";
// Phobos y Deimos
Luna(Lunas, Planetas[4], 0.05, 0.75, 0.38, 0x555555, Math.PI / 4, undefined, phobosb, true);
Luna(Lunas, Planetas[4], 0.05, 0.75, 0.38, 0x555555, -Math.PI, undefined, deimosb, true);

// Júpiter
Planeta("Júpiter", Planetas, scene, scene, 1.5, -20.0, -0.25, 0xffffff, 1.0, 1.0, 0.05, jupm);
Planetas[5].rotation.z = 3.13 * rotationValue;
Planetas[5].userData.mass = "1.898 × 10²⁷ kg";
Planetas[5].userData.diameter = "139,820 km";
Planetas[5].userData.gravity = "24.79 m/s²";

// Saturno
Planeta("Saturno", Planetas, scene, scene, 1.25, -25.0, -0.2, 0xffffff, 1.0, 1.0, 0.045, satm);
Planetas[6].rotation.z = 26.73 * rotationValue;
Planetas[6].userData.mass = "5.683 × 10²⁶ kg";
Planetas[6].userData.diameter = "116,460 km";
Planetas[6].userData.gravity = "10.44 m/s²";
ringsPlanet(Planetas[6], 1.5, 2.3, sarturnringm, sarturnringt, 0xffffff, Math.PI / 2);

// Urano
Planeta("Urano", Planetas, scene, scene, 0.75, -30.0, 0.15, 0xffffff, 1.0, 1.0, 0.03, uram);
Planetas[7].rotation.z = 97.77 * rotationValue;
Planetas[7].userData.mass = "8.681 × 10²⁵ kg";
Planetas[7].userData.diameter = "50,724 km";
Planetas[7].userData.gravity = "8.69 m/s²";
ringsPlanet(Planetas[7], 1.0, 1.3, uranringm, uranringt, 0xffffff);

// Neptuno
Planeta("Neptuno", Planetas, scene, scene, 0.7, -35.0, -0.125, 0xffffff, 1.0, 1.0, 0.033, nepm);
Planetas[8].rotation.z = 28.32 * rotationValue;
Planetas[8].userData.mass = "1.024 × 10²⁶ kg";
Planetas[8].userData.diameter = "49,244 km";
Planetas[8].userData.gravity = "11.15 m/s²";

}

export function Planeta(
 planetName=undefined,Planetas,scene,padre,radio,dist,vel,col,f1,f2,rotSpeed,
 texture = undefined,
 texbump = undefined,
 texspec = undefined,
 texalpha = undefined,
 sombra = false,
 tierranoche = undefined
) {
  let geom = new THREE.SphereGeometry(radio, 20, 20);
  let material = new THREE.MeshPhongMaterial({ color: col});

  //Textura
  if (texture != undefined) {
    material.map = texture;
  }
  //Rugosidad
  if (texbump != undefined) {
    material.bumpMap = texbump;
    material.bumpScale = 0.1;
  }

 //Especular
  if (texspec != undefined) {
    material.specularMap = texspec;
    material.specular = new THREE.Color("orange");
 }

 //Transparencia
 if (texalpha != undefined) {
  //Con mapa de transparencia
  material.alphaMap = texalpha;
  material.transparent = true;
  material.side = THREE.DoubleSide;
  material.opacity = 1.0;
 }

 let planeta = new THREE.Mesh(geom, material);

 if (tierranoche != undefined) {
    const lightsMat = new THREE.MeshBasicMaterial({
      map: tierranoche,
      blending: THREE.AdditiveBlending,
    });
    let lightsMesh = new THREE.Mesh(geom, lightsMat);
    planeta.add(lightsMesh);
  }

 planeta.userData.dist = dist;
 planeta.userData.speed = vel;
 planeta.userData.f1 = f1;
 planeta.userData.f2 = f2;
 planeta.userData.rotSpeed = rotSpeed;
 planeta.userData.namePlanet = planetName;
 planeta.userData.radio = radio;

 padre.add(planeta);
 Planetas.push(planeta);
 if (sombra) {
  planeta.castShadow = false; // El planeta PROYECTA sombra
  planeta.receiveShadow = true; // El planeta RECIBE sombra de otros objetos
 }
 scene.add(planeta);

 //Dibuja trayectoria, con
 let curve = new THREE.EllipseCurve(
  0,
  0, // centro
  dist * f1,
  dist * f2 // radios elipse
 );
 //Crea geometría
 let points = curve.getPoints(50);
 let geome = new THREE.BufferGeometry().setFromPoints(points);
 let mate = new THREE.LineBasicMaterial({ color: 0xffffff });
 // Objeto
 let orbita = new THREE.Line(geome, mate);
 orbita.rotation.x = Math.PI / 2;
 scene.add(orbita);
}

export function Luna(
 Lunas,planeta,radio,dist,vel,col,angle,
 texture = undefined,
 texbump = undefined,
 sombra = true
) {
 var pivote = new THREE.Object3D();
 pivote.rotation.x = angle;
 planeta.add(pivote);
 var geom = new THREE.SphereGeometry(radio, 10, 10);
 var material = new THREE.MeshPhongMaterial({ color: col });

 //Textura
 if (texture != undefined) {
  material.map = texture;
 }
 //Rugosidad
 if (texbump != undefined) {
  material.bumpMap = texbump;
  material.bumpScale = 0.1;
 }

 var luna = new THREE.Mesh(geom, material);
 luna.userData.dist = dist;
 luna.userData.speed = vel;

 if (sombra) {
  luna.castShadow = true; // El planeta PROYECTA sombra
  luna.receiveShadow = true; // El planeta RECIBE sombra de otros objetos
 }

 Lunas.push(luna);
 pivote.add(luna);
}

export function Sun(scene, rad, col, texture = undefined) {
 let geometry = new THREE.SphereGeometry(rad, 20, 20);
 let material = new THREE.MeshBasicMaterial({ color: col });
 let sunObject = new THREE.Mesh(geometry, material);
 if (texture != undefined) {
  material.map = texture;
 }
 sunObject.userData.rotationSpeed = 0.002;
 scene.add(sunObject);
 return sunObject;
}

export function ringsPlanet(padre,innerRadius,outerRadius,texture=undefined,texalpha=undefined,col,angle=undefined) {  
 let geom = new THREE.RingBufferGeometry( innerRadius, outerRadius, 128);
 let material = new THREE.MeshPhongMaterial({ color: col });

 const pos = geom.attributes.position;
 const uv = geom.attributes.uv;
 const v3 = new THREE.Vector3();

 for (let i = 0; i < pos.count; i++) {
  v3.fromBufferAttribute(pos, i);
  const r = Math.sqrt(v3.x * v3.x + v3.y * v3.y);
  const t = (r - innerRadius) / (outerRadius - innerRadius);
  uv.setXY(i, t, 1.0);
 }

 //Textura
 if (texture != undefined) {
  material.map = texture;
 }
 //Transparencia
 if (texalpha != undefined) {
  //Con mapa de transparencia
  material.alphaMap = texalpha;
  material.transparent = true;
  material.side = THREE.DoubleSide;
  material.opacity = 1.0;
  material.side = THREE.DoubleSide;
 } 

 const anillos = new THREE.Mesh(geom, material);
 if (angle != undefined){anillos.rotation.x = angle}
 padre.add(anillos);
}

function createPlanetLabel(nombre) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "Bold 60px Arial";
  context.fillStyle = "white";
  context.fillText(nombre, 0, 60);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(2.5, 1.25, 1.0); // tamaño del texto
  sprite.center.set(0.5, 0); // anclar abajo (mejor para no quedar dentro del planeta)

  sprite.userData.isLabel = true; // marcarlo para actualizar luego
  return sprite;
}