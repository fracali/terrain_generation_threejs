import { AxesHelper, Object3D } from "three";
import Constants from "../Constants";
import DirLight from "../lights/DirLight";
import HemiLight from "../lights/HemiLight";
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
    tree.container.position.setY(
      noiseHeight * Constants.terrainHeightIntensity
    );
    this.container.add(tree.container);
    console.log("tree location", tree.container.position);
  }

  setAxes() {
    this.axis = new AxesHelper(1000);
    this.container.add(this.axis);
  }

  setLights() {
    this.container.add(new HemiLight(this.terrainNoise, { addHemiLightHelper: true }).container);
    this.container.add(new DirLight({ addHelper: true }).container);
  }

  setFloor() {
    this.floor = new Floor(this.terrainNoise);
    this.container.add(this.floor.container);
  }
}
