import {
  AxesHelper,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
  Object3D,
} from "three";
import Constants from "../Constants";
import Floor from "./Floor";
import TerrainNoise from "./TerrainNoise";
import Tree from "./Tree";

export default class World {
  worldCenterX: number;
  worldCenterZ: number;

  constructor(
    private terrainNoise: Uint8Array,
    public container: Object3D = new Object3D(),
    private axis?: AxesHelper,
    private floor?: Floor //private resources?: any
  ) {
    // Set up
    this.container = new Object3D();
    this.container.matrixAutoUpdate = false;
    this.worldCenterX = Constants.terrainWidth / 2;
    this.worldCenterZ = Constants.terrainDepth / 2;

    this.setAxes();
    this.setLights();
    this.setFloor();
    this.addTree();
  }

  addTree() {
    if (!this.floor) {
      return;
    }
    const treeX = 500;
    const treeZ = 500;

    const noiseInstance = new TerrainNoise();
    const noiseHeight = noiseInstance.getNoiseValueAtPosition(
      this.terrainNoise,
      treeX,
      treeZ
    );
    const tree = new Tree();
    tree.container.position.set(treeX, 0, treeZ);
    console.log("tree.height", noiseHeight);
    tree.container.position.setY(
      noiseHeight * Constants.terrainHeightIntensity
    );
    //tree.container.scale.set(0.1, 0.1, 0.1);
    this.container.add(tree.container);
  }

  setAxes() {
    this.axis = new AxesHelper(1000);
    this.container.add(this.axis);
  }

  setLights() {
    // TODO: move lights to a separate class
    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    this.container.add(hemiLight);

    const hemiLightHelper = new HemisphereLightHelper(hemiLight, 10);
    this.container.add(hemiLightHelper);

    const dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(500);
    this.container.add(dirLight);

    dirLight.castShadow = true;

    // Qualità ombre
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;

    const d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;

    const dirLightHelper = new DirectionalLightHelper(dirLight, 10, 0xff0000);
    this.container.add(dirLightHelper);
  }

  setFloor() {
    this.floor = new Floor(this.terrainNoise);
    this.container.add(this.floor.container);
  }
}
