import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Constants from "./Constants";

export default class Camera {
  constructor(
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
