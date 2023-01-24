import * as THREE from "three";

export default class Lights {
  constructor() {
    this.container = new THREE.Object3D();
    this.setAmbientLight();
  }

  setAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.ambientLight = ambientLight;
  }

  setDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    this.directionalLight = directionalLight;
  }
}
