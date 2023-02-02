import {
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  Object3D,
} from "three";
import Constants from "../Constants";

export default class {
  container: Object3D;
  addHelper: boolean;
  private worldCenterX: number;
  private worldCenterZ: number;

  constructor({ addHelper = false }) {
    this.addHelper = addHelper;
    this.worldCenterX = Constants.terrainWidth / 2;
    this.worldCenterZ = Constants.terrainDepth / 2;
    this.container = new Object3D();

    const lightTarget = new Object3D();
    lightTarget.position.set(this.worldCenterX, 0, this.worldCenterZ);

    const dirLightHeight = Constants.terrainDepth * 1.5;

    const dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, dirLightHeight, 1);

    // Qualità ombre
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;

    const cameraSize = 1000;

    dirLight.shadow.camera.far = 2000;
    dirLight.shadow.camera.near = 100;
    dirLight.shadow.camera.left = -cameraSize;
    dirLight.shadow.camera.right = cameraSize;
    dirLight.shadow.camera.top = cameraSize;
    dirLight.shadow.camera.bottom = -cameraSize;

    dirLight.target = lightTarget;
    this.container.add(dirLight);

    //Directional light helper
    if (this.addHelper) {
      const helper = new CameraHelper(dirLight.shadow.camera);
      this.container.add(helper);
      const dirLightHelper = new DirectionalLightHelper(dirLight, 10, 0xff0000);
      this.container.add(dirLightHelper);
      dirLight.target.updateMatrixWorld();
    }
  }
}
