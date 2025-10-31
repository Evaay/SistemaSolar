import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import { initFLyControls } from "./initFlyControls.js";
import { initLights } from "./initLights.js";
import { getStarfield } from "./getStarField.js";
import { initElements, sun, materialArray } from "./initElements.js";

// Fuentes
//https://threejs.org/docs/#manual/en/introduction/Creating-a-scene -->
//https://r105.threejsfundamentals.org/threejs/lessons/threejs-primitives.html  -->
let scene, camera, renderer;
let objetos = [];
let sombra = true;
let camcontrols;
let info;

let grid, perfil, plano;
const MAX_POINTS = 500;
let raycaster;

let Planetas = [],
    Lunas = [],
    Asteroides = [];

let t0 = new Date();
let accglobal = 0.001;
let timestamp;

let starPositions;
let stars;

// GUI
const gui = new GUI();

let flyControlsOn = true;
let flyControls;

let asteroidsTexture = new THREE.TextureLoader().load("public/textures/mars/phobosbump.jpg");

let followPlanet = {
  active: false,
  planeta: "Tierra",
  information: true
};
let activeFlyControls = {
  active: false
};
let posInitial = {
  restoreCameraPos: restoreCameraPos
}
let activeOrbitControls = {
  active: true
};
let activeCrear = {
  active: false
};
let deletePlanets = {
  deleteplanet: deleteplanet
}

init();
animationLoop();

function init() {
  info = document.createElement("div");
  info.style.position = "absolute";
  info.style.top = "30px";
  info.style.width = "25%";
  info.style.textAlign = "center";
  info.style.color = "#fff";
  info.style.fontWeight = "bold";
  info.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  info.style.backdropFilter = "blur(5px)";
  info.style.fontFamily = "Monospace";
  info.style.zIndex = "1";
  info.innerHTML = `<h2>Sistema solar</h2>`;
  document.body.appendChild(info);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 10, 0);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (flyControlsOn) {
    flyControls = initFLyControls(camera, renderer);
  }

  if (sombra) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // por defecto THREE.PCFShadowMap
  }

  document.body.appendChild(renderer.domElement);

  //controlar con raton posicion camara
  camcontrols = new OrbitControls(camera, renderer.domElement);
  camcontrols.maxDistance = 100;

  initStars();
  //initGrid();
  initElements(Planetas, Lunas, scene, sun);

  //Creo un plano en z=0 que no muestro para la intersección
  let geometryp = new THREE.PlaneGeometry(80, 80);
  let materialp = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  plano = new THREE.Mesh(geometryp, materialp);
  plano.visible = false;
  plano.rotation.x = -Math.PI / 2;
  scene.add(plano);

  //LUCES
  initLights(scene, sombra, gui);

  //Rayo para intersección
  raycaster = new THREE.Raycaster();

  //Manejador de eventos
  document.addEventListener("mousedown", onDocumentMouseDown);
  asteroids(16.8, 0.01, asteroidsTexture);

  //gui
  const vista = gui.addFolder("Seguir planeta");
  vista.add(followPlanet, 'active').name('Seguir planeta').onChange((value) => {
    if (!value) {
      camcontrols.enabled = true;
    }
  });
  vista.add(followPlanet, 'information').name('Info-text').onChange((value) => {
    if (value && followPlanet.active){
      updateInfoPanel(followPlanet.planeta);
    }
  })
  const planetSelector = vista.add(followPlanet, 'planeta', [
    "Mercurio", "Venus", "Tierra", "Marte", "Júpiter", "Saturno", "Urano", "Neptuno"
  ]).name('Planeta a seguir').onChange((selectedName) => {
    if (followPlanet.active) {
      const planet = Planetas.find(obj => 
        obj.userData && obj.userData.namePlanet === selectedName
      );
      let distCamera = planet.userData.radio * 2;
      // Calcular posición de la cámara
      camera.position.set(
        planet.position.x + distCamera,
        planet.position.y + distCamera,
        planet.position.z + distCamera
      );
      // Apuntar la cámara hacia el planeta
      camera.lookAt(planet.position);
      camcontrols.target.copy(planet.position);
      camcontrols.update();
    }}
  );

  updateInfoPanel(followPlanet.planeta);

  const controlsFolder = gui.addFolder("Controles de Cámara");
  controlsFolder.add(activeFlyControls, 'active').name('FlyControls').onChange((value) => {
    if (value) {
      flyControlsOn = true;
      camcontrols.enabled = false;
      activeFlyControls.active = true;
      activeOrbitControls.active = false;
      gui.controllersRecursive().forEach(controller => controller.updateDisplay());
    } else {
      flyControlsOn = false;
      camcontrols.enabled = true;
      activeFlyControls.active = false;
      activeOrbitControls.active = true;
      gui.controllersRecursive().forEach(controller => controller.updateDisplay());
    }
  })
  controlsFolder.add(activeOrbitControls, 'active').name('Orbit Controls').onChange((value) => {
    if (value) {
      camcontrols.enabled = true;
      flyControlsOn = false;
      activeFlyControls.active = false;
      activeOrbitControls.active = true;
      gui.controllersRecursive().forEach(controller => controller.updateDisplay());
    } else {
      camcontrols.enabled = false;
      flyControlsOn = true;
      activeFlyControls.active = true;
      activeOrbitControls.active = false;
      gui.controllersRecursive().forEach(controller => controller.updateDisplay());
    }
  });
  gui.add(posInitial, 'restoreCameraPos').name('Restaurar posicion inicial');
  gui.add(activeCrear, 'active').name('Crear nuevo planeta');
  gui.add(deletePlanets, 'deleteplanet').name('Eliminar nuevos planetas');
}

function initGrid() {
  //Asistente GridHelper
  grid = new THREE.GridHelper(80, 80);
  grid.position.set(0, 0, 0);
  grid.geometry.rotateX(Math.PI / 2);
  //Desplaza levemente hacia la cámara
  grid.position.set(0, 0, 0.05);
  scene.add(grid);
}

function restoreCameraPos() {
  camera.position.set(10, 10, 0);
  camera.lookAt(sun.position);
  camcontrols.target.copy(sun.position);
  camcontrols.update();
  followPlanet.active = false;
  gui.controllersRecursive().forEach(controller => controller.updateDisplay());
  info.style.backdropFilter = "none";
  info.style.backgroundColor = "transparent";
  info.innerHTML = "<h2>Sistema solar</h2>";
}

function deleteplanet() {
  for (let obj of objetos) {
    scene.remove(obj); 
    scene.remove(obj.userData.orbit);
  }
}

function initStars() {
  stars = getStarfield(2000);
  scene.add(stars);
  starPositions = stars.geometry.attributes.position.array;
}

function asteroids(dist, vel, texture=undefined, numAsteroids=250) {
  for (let i = 0; i < numAsteroids; i++) {
    const angle = (i / numAsteroids) * Math.PI * 2;
    const f1 = 1.0 + (Math.random() - 0.5) * 0.05;
    const f2 = 1.0 + (Math.random() - 0.5) * 0.05;
    const r = Math.random() * 0.15 + 0.05;

    rocks(r, dist, vel, 0x444444, f1, f2, angle, texture);
  }
}

function rocks(radio, dist, vel, col, f1, f2, angle, texture = undefined) {
  const geom = new THREE.OctahedronGeometry(radio, 1);
  const material = new THREE.MeshPhongMaterial({ color: col });

  if (texture !== undefined) {
    material.map = texture;
  }

  const asteroid = new THREE.Mesh(geom, material);
  asteroid.position.x = Math.cos(angle) * dist * f1;
  asteroid.position.z = Math.sin(angle) * dist * f2;
  asteroid.position.y = (Math.random() - 0.5) * 1.0;
  asteroid.userData = {
    dist: dist,
    speed: vel,
    f1: f1,
    f2: f2,
    angle: angle,
    startTime: timestamp,
  };
  Asteroides.push(asteroid);
  scene.add(asteroid);
}

function updateInfoPanel(planetName) {
  const planet = Planetas.find(obj => 
    obj.userData && obj.userData.namePlanet === planetName
  );
  
  if (planet && planet.userData) {
    info.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    info.innerHTML = `
      <h2>${planet.userData.namePlanet}</h2>
      <p><strong>Masa:</strong> ${planet.userData.mass}</p>
      <p><strong>Diámetro:</strong> ${planet.userData.diameter}</p>
      <p><strong>Gravedad:</strong> ${planet.userData.gravity}</p>
    `;
  }
}

//Bucle de animación
function animationLoop() {
  timestamp = (Date.now() - t0) * accglobal;

  requestAnimationFrame(animationLoop);

  sun.rotation.y += sun.userData.rotationSpeed;

  //Modifica rotación de todos los objetos
  for (let object of Planetas) {
    object.rotation.y += object.userData.rotSpeed;
    object.position.x =
      Math.cos(timestamp * object.userData.speed) *
      object.userData.f1 *
      object.userData.dist;
    object.position.z =
      Math.sin(timestamp * object.userData.speed) *
      object.userData.f2 *
      object.userData.dist;
  }

  for (let object of Lunas) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed) * object.userData.dist;
    object.position.z =
      Math.sin(timestamp * object.userData.speed) * object.userData.dist;
  }

  for (let object of Asteroides) {
    object.position.x =
      Math.cos(timestamp * object.userData.speed + object.userData.angle) *
      object.userData.f1 *
      object.userData.dist;
    object.position.z =
      Math.sin(timestamp * object.userData.speed + object.userData.angle) *
      object.userData.f2 *
      object.userData.dist;
  }

  for (let object of objetos) {
    const time = timestamp - object.userData.pickTime;
    object.position.x =
      Math.cos(object.userData.angle + object.userData.speed * time) *
      object.userData.f1 *
      object.userData.dist;
    object.position.z =
      Math.sin(object.userData.angle + object.userData.speed * time) *
      object.userData.f2 *
      object.userData.dist;
  }

  // Movimiento de estrellas: rotación lenta alrededor de Y
  for (let i = 0; i < starPositions.length; i += 3) {
    let x = starPositions[i];
    let z = starPositions[i + 2];
    const angle = 0.0005;
    //rotacion sobre eje y
    starPositions[i] = x * Math.cos(angle) - z * Math.sin(angle);
    starPositions[i + 2] = x * Math.sin(angle) + z * Math.cos(angle);
  }
  stars.geometry.attributes.position.needsUpdate = true;

  if (activeFlyControls.active) {
    if (flyControlsOn) {
      let t1 = new Date();
      let secs = (t1 - t0) / 1000;
      flyControls.update(1 * secs);
    }
  }

  if (followPlanet.active) {
    // Buscar el planeta actual
    const planet = Planetas.find(obj => 
      obj.userData && obj.userData.namePlanet === followPlanet.planeta
    );
    let distCamera = planet.userData.radio * 2;
    // Calcular posición de la cámara
    camera.position.set(
      planet.position.x + distCamera,
      planet.position.y + distCamera,
      planet.position.z + distCamera
    );

    // Apuntar la cámara hacia el planeta
    camera.lookAt(planet.position);
    camcontrols.target.copy(planet.position);
    camcontrols.update();

    if (followPlanet.information) {
      updateInfoPanel(followPlanet.planeta);
    } else {
      info.style.backdropFilter = "none";
      info.style.backgroundColor = "transparent";
      info.innerHTML = "<h2>Sistema solar</h2>";
    }
  } else {
    info.style.backdropFilter = "none";
    info.style.backgroundColor = "transparent";
    info.innerHTML = "<h2>Sistema solar</h2>";
  }

  renderer.render(scene, camera);
}

function onDocumentMouseDown(event) {
  if (activeCrear.active) {
    if (event.target.closest('.lil-gui')) return;
    //Conversión coordenadas del puntero
    const mouse = {
      x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    };

    //Intersección, define rayo
    raycaster.setFromCamera(mouse, camera);

    // Intersecta
    const intersects = raycaster.intersectObject(plano);
    // ¿Hay alguna intersección?
    if (intersects.length > 0) {
      //Muestra el valor de la intersección
      console.log(intersects[0].point);

      const createPlanetTime = (Date.now() - t0) * accglobal;

      Sphere(
        intersects[0].point.x,
        intersects[0].point.y,
        intersects[0].point.z,
        THREE.MathUtils.randFloat(0.3, 1),
        10,
        10,
        THREE.MathUtils.randInt(0xcce0e0, 0xffffff),
        THREE.MathUtils.randFloat(0.5, 2),
        //1.0,
        1.0,
        1.0,
        createPlanetTime
      );
    }
  }
}

function Sphere(px, py, pz, radio, nx, ny, col, vel, f1, f2, pickTime) {
  let geometry = new THREE.SphereBufferGeometry(radio, nx, ny);
  //Material con o sin relleno
  const randomMaterial = materialArray[Math.floor(Math.random() * materialArray.length)];
  let material = new THREE.MeshPhongMaterial({
    color: col,
    map: randomMaterial,
    //wireframe: true, //Descomenta para activar modelo de alambres
  });

  let planeta = new THREE.Mesh(geometry, material);
  let dist = Math.sqrt(px * px + pz * pz);
  let angle = Math.atan2(pz, px);
  //vel -> velocidad angular
  planeta.userData.pickTime = pickTime;
  planeta.userData.angle = angle;
  planeta.userData.dist = dist;
  planeta.userData.speed = vel;
  planeta.userData.f1 = f1;
  planeta.userData.f2 = f2;
  //Posición de la esfera
  planeta.position.set(px, py, pz);
  if (sombra) planeta.castShadow = true;
  scene.add(planeta);
  objetos.push(planeta);
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
  orbita.rotation.x = -Math.PI /2;
  scene.add(orbita);
  planeta.userData.orbit = orbita;
}