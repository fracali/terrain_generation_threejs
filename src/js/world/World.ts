import { AxesHelper, Mesh, Object3D, Scene } from "three";
import Constants from "../Constants";
import DirLight from "../lights/DirLight";
import HemiLight from "../lights/HemiLight";
import Instancing from "../utils/Instancing";
import Floor from "./Floor";
import Tree from "./objects/Tree";
import TreeTrunk from "./objects/TreeTrunk";

export default class World {
  worldCenterX: number;
  worldCenterZ: number;

  constructor(
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
    //this.addTreeTrunks();
    this.addTrees();
  }

  async addTrees() {
    if (!this.floor) {
      return;
    }

    const tree = new Tree();
    const treeMesh: Mesh = await tree.getMesh();

    const instancing = new Instancing({
      object: treeMesh,
      surface: this.floor.container,
      instances: 1000,
      scene: this.scene,
      minScale: 0.0005,
      maxScale: 0.001,
      yRandomRotation: true,
      isDynamic: true,
    });

    instancing.doInstancing();
    this.container.updateMatrix();
    this.container.updateMatrixWorld();
  }

  async addTreeTrunks() {
    if (!this.floor) {
      return;
    }

    const trunk = new TreeTrunk();
    const treeMesh: Mesh = await trunk.getMesh();

    const instancing = new Instancing({
      object: treeMesh,
      surface: this.floor.container,
      instances: 1000,
      scene: this.scene,
      minScale: 0.3,
      maxScale: 0.5,
      xRotationCompensation: -Math.PI / 2,
      zRandomRotation: true,
    });

    instancing.doInstancing();
    this.container.updateMatrix();
  }

  setAxes() {
    this.axis = new AxesHelper(1000);
    this.container.add(this.axis);
  }

  setLights() {
    this.container.add(new HemiLight({}).container);
    this.container.add(new DirLight({}).container);
  }

  setFloor() {
    this.floor = new Floor();
    this.container.add(this.floor.container);
  }
}
