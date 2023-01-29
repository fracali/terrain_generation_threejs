import * as THREE from "three";
import Camera from "./Camera";
import FPSCounter from "./utils/FPSCounter";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import World from "./world/index";
// @ts-ignore
import skyFragmentShader from "../shaders/sky/sky_fragment.glsl";
// @ts-ignore
import skyVertexShader from "../shaders/sky/sky_vertex.glsl";

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
    this.setFPSCounter();
    this.setWorld();
    this.setSky();
    //this.setHelpers();
  }

  setConfig() {
    this.config = {};
    this.config.debug = false;
  }

  setRenderer() {
    // Scene
    this.scene = new THREE.Scene();

    // Sky
    this.scene.background = new THREE.Color().setHSL(0.6, 0, 1);

    // Fog
    this.scene.fog = new THREE.Fog(this.scene.background, 1, 5000);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(2);
    this.renderer.setSize(
      this.sizes.viewport.width,
      this.sizes.viewport.height
    );
    this.renderer.physicallyCorrectLights = true;
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;

    // Resize event
    this.sizes.on("resize", () => {
      this.renderer?.setSize(
        this.sizes.viewport.width,
        this.sizes.viewport.height
      );
    });

    // Render loop
    this.time.on("tick", () => {
      this.fpsCounter?.begin();
      if (!this.camera) return;
      if (!this.renderer) return;
      if (!this.scene) return;
      if (!this.camera) return;
      if (!this.camera.instance) return;
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

    console.log(this.camera.instance);
  }

  setHelpers() {
    let axesHelper = new THREE.AxesHelper(5);
    this.scene?.add(axesHelper);

    let gridHelper = new THREE.GridHelper(10, 10);
    this.scene?.add(gridHelper);
  }

  setWorld() {
    /* let floor = new Floor();
    floor.geometry.rotateX(Math.PI * -0.5);
    this.scene?.add(floor.container); */

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

  setSky() {
    // SKYDOME

    if (!this.scene) return;
    if (!this.scene.fog) return;

    const vertexShader = skyVertexShader;
    const fragmentShader = skyFragmentShader;
    const uniforms = {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0xffffff) },
      offset: { value: 33 },
      exponent: { value: 0.6 },
    };

    // Copia di hemiLight in world/index.js
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    uniforms["topColor"].value.copy(hemiLight.color);

    this.scene.fog.color.copy(uniforms["bottomColor"].value);

    const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide,
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(sky);
    console.log("sky");
  }

  setFPSCounter() {
    this.fpsCounter = new FPSCounter();
  }
}
