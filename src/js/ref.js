

// @author prisoner849

import * as THREE from "../jsm/three.module.126.js";
import { OrbitControls } from "../jsm/OrbitControls.126.js";
import { ImprovedNoise } from "../jsm/ImprovedNoise.126.js";

const perlin = new ImprovedNoise();

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 100);
camera.position.set(0, 2.5, 10);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.GridHelper(10, 10, 0x007f7f, 0x007f7f));

let g = new THREE.PlaneGeometry(10, 10, 10, 10);
g.rotateX(Math.PI * -0.5);
let m = new THREE.MeshBasicMaterial({wireframe: true, color: 0x00ff69});
let o = new THREE.Mesh(g, m);
scene.add(o);

let pos = g.attributes.position;
let uv = g.attributes.uv;
let vUv = new THREE.Vector2();

let clock = new THREE.Clock();

renderer.setAnimationLoop( _ => {
	let t = clock.getElapsedTime();
	for(let i = 0; i < pos.count; i++){
  	vUv.fromBufferAttribute(uv, i).multiplyScalar(2.5);
  	let y = perlin.noise(vUv.x, vUv.y + t, t * 0.1);
    pos.setY(i, y);
  }
  pos.needsUpdate = true;
	renderer.render(scene, camera);
})
