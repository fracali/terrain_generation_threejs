import {
  AxesHelper,
  BackSide,
  Color,
  Fog,
  GridHelper,
  HemisphereLight,
  Mesh,
  PCFSoftShadowMap,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import Camera from "./Camera";
import FPSCounter from "./utils/FPSCounter";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import World from "./world/index";
// @ts-ignore
import skyFragmentShader from "../shaders/sky/sky_fragment.glsl";
// @ts-ignore
import skyVertexShader from "../shaders/sky/sky_vertex.glsl";
import Constants from "./Constants";
import noise from "./world/noise";

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
    //this.setFPSCounter();
    this.setNoise();
    this.setWorld();
    this.setSky();
    //this.setHelpers();
  }

  setConfig() {
    this.config = {};
    this.config.debug = false;
  }

  setNoise() {
    this.terrainNoise = noise(Constants.worldWidth, Constants.worldDepth);
  }

  setRenderer() {
    // Scene
    this.scene = new Scene();

    // Sky
    this.scene.background = new Color().setHSL(0.6, 0, 1);

    // Fog
    this.scene.fog = new Fog(
      this.scene.background,
      Constants.fogNear,
      Constants.fogFar
    );

    // Renderer
    this.renderer = new WebGLRenderer({
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
    this.renderer.shadowMap.type = PCFSoftShadowMap;

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
  }

  setHelpers() {
    let axesHelper = new AxesHelper(5);
    this.scene?.add(axesHelper);

    let gridHelper = new GridHelper(10, 10);
    this.scene?.add(gridHelper);
  }

  setWorld() {
    this.world = new World({
      config: this.config,
      resources: this.resources,
      time: this.time,
      sizes: this.sizes,
      camera: this.camera,
      renderer: this.renderer,
      terrainNoise: this.terrainNoise,
    });
    this.scene?.add(this.world.container);
  }

  setSky() {
    if (!this.scene) return;
    if (!this.scene.fog) return;

    const vertexShader = skyVertexShader;
    const fragmentShader = skyFragmentShader;
    const uniforms = {
      topColor: { value: new Color(0x0077ff) },
      bottomColor: { value: new Color(0xffffff) },
      offset: { value: 300 },
      exponent: { value: 0.6 },
    };

    // Copia di hemiLight in world/index.js
    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.5);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    uniforms["topColor"].value.copy(hemiLight.color);

    this.scene.fog.color.copy(uniforms["bottomColor"].value);

    const skyGeo = new SphereGeometry(Constants.skyRadius, 32, 15);
    const skyMat = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: BackSide,
    });

    const sky = new Mesh(skyGeo, skyMat);
    this.scene.add(sky);
  }

  setFPSCounter() {
    this.fpsCounter = new FPSCounter();
  }
}
