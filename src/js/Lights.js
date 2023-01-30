import * as THREE from "three";

export default class Lights {
  constructor() {
    this.container = [];
    this.setAmbientLight();
    this.setDirectionalLight();
  }

  setAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.ambientLight = ambientLight;
    const ambientLightObj = new THREE.Object3D();
    ambientLightObj.add(ambientLight);
    this.container.push(ambientLightObj);
  }

  setDirectionalLight() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    this.directionalLight = directionalLight;
    this.container.push(directionalLight);

    // Helper
    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight,
      0.2,
      0xff0000
    );
    this.directionalLightHelper = directionalLightHelper;
    this.container.push(directionalLightHelper);
  }
}
