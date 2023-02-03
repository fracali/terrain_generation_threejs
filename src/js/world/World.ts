import { AxesHelper, Object3D } from "three";
import Constants from "../Constants";
import DirLight from "../lights/DirLight";
import HemiLight from "../lights/HemiLight";
import Instancing from "../utils/Instancing";
import Floor from "./Floor";
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
    this.addTrees();
  }

  addTrees() {
    if (!this.floor) {
      return;
    }

    const treeX = 500;
    const treeZ = 500;

    const instancing = new Instancing(
      () => new Tree(),
      this.floor.container,
      1000,
      this.terrainNoise
    );
    this.container.add(instancing.container);
    console.log(instancing.container);
    console.log(this.container);

    /* const noiseInstance = new TerrainNoise();
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
    this.container.add(tree.container); */
  }

  setAxes() {
    this.axis = new AxesHelper(1000);
    this.container.add(this.axis);
  }

  setLights() {
    this.container.add(
      new HemiLight(this.terrainNoise, { addHemiLightHelper: true }).container
    );
    this.container.add(new DirLight({ addHelper: true }).container);
  }

  setFloor() {
    this.floor = new Floor(this.terrainNoise);
    this.container.add(this.floor.container);
  }
}
