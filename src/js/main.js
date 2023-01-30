import ImprovedNoise from "improved-noise";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Lights from "./lights";
import Floor from "./world/floor";

const noiseSpeed = 0.2;

//let fpsCounter = new FPSCounter();
let camera;
let clock;
let perlin;
let scene;
let renderer;
let controls;
let plane;
let planePosition;
let planeUV;
let planeVUv;

function setup() {
  setUpCamera();
  setUpClock();
  setupNoise();
  setupScene();
  setupRenderer();
  setupFPSCounter();
  setupControls();
  setupWorld();
  setupDebug();
}

function setUpCamera() {
  camera = new THREE.PerspectiveCamera(100, innerWidth / innerHeight, 1, 100);
  camera.position.set(0, 2.5, 10);
}

function setUpClock() {
  clock = new THREE.Clock();
}

function setupNoise() {
  perlin = ImprovedNoise();
}

function setupScene() {
  scene = new THREE.Scene();
}

function setupRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  document.body.appendChild(renderer.domElement);
}

function setupFPSCounter() {
  //fpsCounter.begin();
}

function setupControls() {
  controls = new OrbitControls(camera, renderer.domElement);
}

function setupWorld() {

  let floor = new Floor();
  floor.geometry.rotateX(Math.PI * -0.5);
  scene.add(floor.container);

  planePosition = floor.geometry.attributes.position;
  planeUV = floor.geometry.attributes.uv;
  planeVUv = new THREE.Vector2();
}

function animate() {
  renderer.setAnimationLoop((_) => {
    //fpsCounter.begin();

    let t = clock.getElapsedTime();
    for (let i = 0; i < planePosition.count; i++) {
      planeVUv.fromBufferAttribute(planeUV, i).multiplyScalar(2.5);
      let y = perlin.noise(
        planeVUv.x,
        planeVUv.y + t * noiseSpeed,
        t * noiseSpeed
      );
      planePosition.setY(i, y);
    }

    planePosition.needsUpdate = true;
    renderer.render(scene, camera);
    //fpsCounter.end();
  });
}

function setupDebug() {
  let axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  let gridHelper = new THREE.GridHelper(10, 10);
  //scene.add(gridHelper);
}

setup();
animate();
