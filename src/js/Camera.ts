import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Constants from "./Constants";
import TerrainNoise from "./world/TerrainNoise";

export default class Camera {
  cameraX: number = 50;
  cameraZ: number = 50;
  constructor(
    private terrainNoise: Uint8Array,
    private time: any,
    private sizes: any,
    private renderer: any,
    private config: any,
    _options?: any,
    public instance?: PerspectiveCamera,
    private orbitControls?: OrbitControls
  ) {
    this.setInstance();
    this.setOrbitControls();
    //this.setHeight();
  }

  setInstance() {
    // Set up
    this.instance = new PerspectiveCamera(
      Constants.cameraFov,
      this.sizes.viewport.width / this.sizes.viewport.height,
      Constants.cameraNear,
      Constants.cameraFar
    );

    this.instance.lookAt(new Vector3());
    this.instance.position.set(this.cameraX, 50, this.cameraZ);

    // Resize event
    this.sizes.on("resize", () => {
      if (this.instance)
        this.instance.aspect =
          this.sizes.viewport.width / this.sizes.viewport.height;

      this.instance?.updateProjectionMatrix();
    });
  }

  // 1500 : x = 2000 : 256
  // (1500 x 256) / 2000

  setHeight() {
    let cameraPosition = this.instance?.position;
    if (!cameraPosition) return;

    const noiseInstance = new TerrainNoise();
    const noiseHeight = noiseInstance.getNoiseValueAtPosition(
      this.terrainNoise,
      cameraPosition.x,
      cameraPosition.z
    );

    this.instance?.position.setY(noiseHeight + 100);
  }

  setOrbitControls() {
    if (this.config.orbitControls || !this.instance) return;
    this.orbitControls = new OrbitControls(
      this.instance,
      this.renderer.domElement
    );
  }
}
