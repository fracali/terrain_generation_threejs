import * as THREE from "three";
import Lights from "../lights";
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
    this.setFloor();
    this.setLights();
  }

  setAxes() {
    this.axis = new THREE.AxesHelper();
    this.container.add(this.axis);
  }

  setLights() {
    this.lights = new Lights();
    this.container.add(this.lights.container);
  }

  setFloor() {
    this.floor = new Floor();

    this.container.add(this.floor.container);
  }
}
