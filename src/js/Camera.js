import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Constants from "./Constants";

export default class Camera {
  constructor(_options) {
    // Options
    this.time = _options.time;
    this.sizes = _options.sizes;
    this.renderer = _options.renderer;
    this.config = _options.config;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    // Set up
    this.instance = new THREE.PerspectiveCamera(
      Constants.cameraFov,
      this.sizes.viewport.width / this.sizes.viewport.height,
      Constants.cameraNear,
      Constants.cameraFar
    );
    this.instance.lookAt(new THREE.Vector3());
    this.instance.position.set(0, 2.5, 10);

    // Resize event
    this.sizes.on("resize", () => {
      if (this.instance)
        this.instance.aspect =
          this.sizes.viewport.width / this.sizes.viewport.height;

      this.instance?.updateProjectionMatrix();
    });
  }

  setOrbitControls() {
    if (this.config.orbitControls || !this.instance) return;
    this.orbitControls = new OrbitControls(
      this.instance,
      this.renderer.domElement
    );
  }
}
