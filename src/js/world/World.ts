import { AxesHelper, Mesh, Object3D, Scene } from "three";
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
    private scene: Scene,
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

  async addTrees() {
    if (!this.floor) {
      return;
    }

    const tree = new Tree();
    const treeMesh: Mesh = await tree.getTree();

    console.log(treeMesh);

    const instancing = new Instancing(
      treeMesh,
      this.floor.container,
      10000,
      this.terrainNoise,
      this.scene
    );

    instancing.doInstancing();
    this.container.updateMatrix();
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
