import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import FPSCounter from "./utils/FPSCounter";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Floor from "./world/floor";

export default class Application {
  constructor(_options) {
    this.$canvas = _options.$canvas;

    this.time = new Time();
    this.sizes = new Sizes();
    this.resources = null;
    // TODO: this.resources = new Resources();

    this.setConfig();
    this.setCamera();
    this.setRenderer();
    this.setFPSCounter();
    this.setWorld();
    this.setHelpers();
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
      alpha: true,
    });
    //this.renderer.setClearColor(0xff0000, 1);
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

    // Render loop
    this.time.on("tick", () => {
      if (!this.camera) return;
      if (!this.renderer) return;
      if (!this.scene) return;
      if (!this.camera) return;
      this.fpsCounter?.begin();
      this.renderer.render(this.scene, this.camera);
      this.fpsCounter?.end();
    });

    // Orbit controls
    if (!this.camera) return;
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer?.domElement
    );
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      100,
      innerWidth / innerHeight,
      1,
      100
    );
    this.camera.position.set(0, 2.5, 10);
    this.scene?.add(this.camera);

    /* this.camera = new Camera({
      time: this.time,
      sizes: this.sizes,
      renderer: this.renderer,
      config: this.config,
    });

    this.scene?.add(this.camera.container); */
  }

  setHelpers() {
    let axesHelper = new THREE.AxesHelper(5);
    this.scene?.add(axesHelper);

    let gridHelper = new THREE.GridHelper(10, 10);
    this.scene?.add(gridHelper);
  }

  setWorld() {
    let floor = new Floor();
    floor.geometry.rotateX(Math.PI * -0.5);
    this.scene?.add(floor.container);

    /* this.world = new World({
      config: this.config,
      resources: this.resources,
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
      renderer: this.renderer,
    });
    this.scene?.add(this.world.container); */
  }

  setFPSCounter() {
    this.fpsCounter = new FPSCounter();
  }
}
