import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// @ts-ignore
import fragmentShader from "../shaders/terrain/terrain_fragment.glsl";
// @ts-ignore
import vertexShader from "../shaders/terrain/terrain_vertex.glsl";

// Canvas
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera
const cameraFOV = 70;
const cameraAspect = window.innerWidth / window.innerHeight;
const cameraNear = 0.01;
const cameraFar = 10000;
const camera = new THREE.PerspectiveCamera(
  cameraFOV,
  cameraAspect,
  cameraNear,
  cameraFar
);
camera.position.set(0, 20, 100);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Plane
const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
geometry.rotateX(-Math.PI / 2);
const heightMap = new THREE.TextureLoader().load("../img/height_map.jpg");
const material = new THREE.ShaderMaterial({
  uniforms: { bumpTexture: { value: heightMap }, bumpScale: { value: 10 } },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

renderer.setAnimationLoop(animate);

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
