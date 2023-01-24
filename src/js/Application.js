import * as THREE from "three";
import Camera from "./Camera";
import FPSCounter from "./utils/FPSCounter";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import World from "./world/index";

export default class Application {
  constructor(_options) {
    this.$canvas = _options.$canvas;

    this.time = new Time();
    this.sizes = new Sizes();
    this.resources = null;
    // TODO: this.resources = new Resources();

    this.setConfig();
    this.setRenderer();
    this.setCamera();
    this.setWorld();
    this.setFPSCounter();
    this.setHelpers();
    this.animate();
  }

  setConfig() {
    this.config = {};
    this.config.debug = false;
  }

  setRenderer() {
    // Scene
    this.scene = new THREE.Scene();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$canvas,
      alpha: false,
    });
    this.renderer.setClearColor(0xff0000, 1);
    this.renderer.setPixelRatio(2);
    this.renderer.setSize(
      this.sizes.viewport.width,
      this.sizes.viewport.height
    );
    this.renderer.physicallyCorrectLights = true;
    this.renderer.autoClear = false;

    // Resize event
    this.sizes.on("resize", () => {
      this.renderer?.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      );
    });

    this.time.on("tick", () => {
      if (!this.camera) return;
      if (!this.renderer) return;
      if (!this.scene) return;
      if (!this.camera.instance) return;
      this.fpsCounter?.begin();
      this.renderer.render(this.scene, this.camera.instance);
      this.fpsCounter?.end();
    });
  }

  setCamera() {
    this.camera = new Camera({
      time: this.time,
      sizes: this.sizes,
      renderer: this.renderer,
      config: this.config,
    });

    this.scene?.add(this.camera.container);
  }

  setHelpers() {
    let axesHelper = new THREE.AxesHelper(5);
    this.scene.add(axesHelper);

    let gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);
  }

  setWorld() {
    this.world = new World({
      config: this.config,
      resources: this.resources,
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
      renderer: this.renderer,
    });
    this.scene?.add(this.world.container);
  }

  setFPSCounter() {
    this.fpsCounter = new FPSCounter();
  }

  animate() {
    this.renderer?.setAnimationLoop((_) => {
      if (!this.scene) return;
      if (!this.camera?.instance) return;
      this.renderer?.render(this.scene, this.camera?.instance);
    });
  }
}
