import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Constants from "./Constants";
import TerrainNoise from "./world/TerrainNoise";

export default class Camera {
  private worldCenterX: number;
  private worldCenterZ: number;

  private distanceFromGround = 0.8;
  private heightAdjustSpeed = 0.01;

  constructor(
    private time: any,
    private sizes: any,
    private renderer: any,
    private config: any,
    _options?: any,
    public instance?: PerspectiveCamera,
    private orbitControls?: OrbitControls
  ) {
    this.worldCenterX = Constants.terrainWidth / 2;
    this.worldCenterZ = Constants.terrainDepth / 2;

    this.setInstance();
    //this.moveToRandomPosition();
    this.moveToWorldEdge();
    this.setHeight();
    this.setOrbitControls();

    this.time.on("tick", () => {
      //this.updateHeight();
    });
  }

  setInstance() {
    // Set up
    this.instance = new PerspectiveCamera(
      Constants.cameraFov,
      this.sizes.viewport.width / this.sizes.viewport.height,
      Constants.cameraNear,
      Constants.cameraFar
    );

    this.instance.position.set(0, 0, 0);

    // Resize event
    this.sizes.on("resize", () => {
      if (this.instance)
        this.instance.aspect =
          this.sizes.viewport.width / this.sizes.viewport.height;

      this.instance?.updateProjectionMatrix();
    });
  }

  moveToWorldEdge() {
    if (!this.instance) return;

    this.instance.position.set(5, 0, 0);
  }

  moveToRandomPosition() {
    if (!this.instance) return;

    const randomX = Math.random() * Constants.terrainWidth;
    const randomZ = Math.random() * Constants.terrainDepth;

    this.instance.position.set(randomX, 0, randomZ);
  }

  setLookAt(x: number, y: number, z: number) {
    if (!this.instance) return;
    const lookAt = new Vector3(x, y, z);
    this.instance.lookAt(lookAt);
    this.instance.updateProjectionMatrix();
  }

  updateHeight() {
    let cameraPosition = this.instance?.position;
    if (!cameraPosition) return;

    const oldHeight = cameraPosition.y;
    const noiseInstance = TerrainNoise.getInstance();
    const futureNoiseHeight =
      noiseInstance.getNoiseValueAtPosition(
        cameraPosition.x,
        cameraPosition.z + 2
      ) *
        Constants.terrainHeightIntensity +
      this.distanceFromGround;

    const heightDifference = futureNoiseHeight - oldHeight;

    const newHeight = oldHeight + heightDifference * this.heightAdjustSpeed;

    this.instance?.position.setY(newHeight);
  }

  setHeight() {
    let cameraPosition = this.instance?.position;
    if (!cameraPosition) return;

    const noiseInstance = TerrainNoise.getInstance();
    const noiseHeight = noiseInstance.getNoiseValueAtPosition(
      cameraPosition.x,
      cameraPosition.z
    );

    this.instance?.position.setY(
      noiseHeight * Constants.terrainHeightIntensity + this.distanceFromGround
    );
  }

  setOrbitControls() {
    if (this.config.orbitControls || !this.instance) return;
    this.orbitControls = new OrbitControls(
      this.instance,
      this.renderer.domElement
    );

    this.orbitControls.target.set(this.worldCenterX, 1, this.worldCenterZ);
    this.orbitControls.update();
  }
}
