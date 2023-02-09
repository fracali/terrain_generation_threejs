import {
  Color,
  FogExp2,
  PCFSoftShadowMap,
  ReinhardToneMapping,
  Scene,
  WebGLRenderer,
} from "three";
import Camera from "./Camera";
import FPSCounter from "./utils/FPSCounter";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import World from "./world/World";

import Constants from "./Constants";
import Sky from "./world/Sky";

export default class Application {
  constructor(
    _options: any,
    private config: any,
    private scene: Scene,
    private renderer: WebGLRenderer,
    private $canvas: any,
    private time = new Time(),
    private sizes = new Sizes(),
    private fpsCounter: FPSCounter,
    private camera: Camera,
    private world: World // TODO: private resources = new Resources();
  ) {
    this.$canvas = _options.$canvas;

    this.setConfig();
    this.setRenderer();
    this.setFPSCounter();
    this.setCamera();
    this.setWorld();
    this.setSky();
  }

  setConfig() {
    this.config = {};
    this.config.debug = false;
  }

  setRenderer() {
    // Scene
    this.scene = new Scene();

    // Sky
    this.scene.background = new Color().setHSL(0.6, 0, 1);

    // Fog
    this.scene.fog = new FogExp2(0x3f88c5, Constants.fogDensity);

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
    this.renderer.toneMapping = ReinhardToneMapping;
    this.renderer.toneMappingExposure = Constants.globalSceneExposure; // <---- Esposizione globale della scena

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
    this.camera = new Camera(this.sizes, this.renderer, this.config);
  }

  setWorld() {
    this.world = new World(this.scene);
    this.scene?.add(this.world.container);
  }

  setSky() {
    if (!this.scene) return;
    if (!this.scene.fog) return;

    this.scene.add(new Sky(this.scene).container);
  }

  setFPSCounter() {
    this.fpsCounter = new FPSCounter();
  }
}
