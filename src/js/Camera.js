import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default class Camera {
  constructor(_options) {
    // Options
    this.time = _options.time;
    this.sizes = _options.sizes;
    this.renderer = _options.renderer;
    this.config = _options.config;

    // Set up
    this.container = new THREE.Object3D();
    this.container.matrixAutoUpdate = false;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    // Set up
    this.instance = new THREE.PerspectiveCamera(
      40,
      this.sizes.viewport.width / this.sizes.viewport.height,
      1,
      1000
    );
    this.instance.up.set(0, 0, 1);
    this.instance.lookAt(new THREE.Vector3());
    this.instance.position.set(0, 2.5, 10);
    this.container.add(this.instance);

    // Resize event
    this.sizes.on("resize", () => {
      if (this.instance)
        this.instance.aspect =
          this.sizes.viewport.width / this.sizes.viewport.height;

      this.instance?.updateProjectionMatrix();
    });

    // Time tick
    this.time.on("tick", () => {
      if (!this.instance) return;
      this.instance.position.set(0, 2.5, 10);
    });
  }

  setOrbitControls() {
    if (!this.config.orbitControls || !this.instance) return;
    this.orbitControls = new OrbitControls(
      this.instance,
      this.renderer.domElement
    );
    this.orbitControls.enabled = true;
    this.orbitControls.zoomSpeed = 0.5;
  }
}
