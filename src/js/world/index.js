import * as THREE from "three";
import Floor from "./floor";

export default class {
  constructor(_options) {
    // Options
    this.config = _options.config;
    this.resources = _options.resources;
    this.time = _options.time;
    this.sizes = _options.sizes;
    this.camera = _options.camera;
    this.renderer = _options.renderer;
    this.passes = _options.passes;

    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setAxes();
    this.setLights();
    this.setFloor();
  }

  setAxes() {
    this.axis = new THREE.AxesHelper();
    this.container.add(this.axis);
  }

  setLights() {
    let hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    this.container.add(hemisphereLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(8, 10, 8);
    this.container.add(directionalLight);

    // Directional light helper
    let directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      1,
      0xff0000
    );
    this.container.add(directionalLightHelper);
  }

  setFloor() {
    this.floor = new Floor();
    this.floor.geometry.rotateX(Math.PI * -0.5);
    this.container.add(this.floor.container);
  }
}
