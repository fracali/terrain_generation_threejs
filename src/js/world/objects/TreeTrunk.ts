import { Mesh } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// @ts-ignore
import treeTrunkModel from "../../../assets/resources/tree_trunk.glb?url";

export default class TreeTrunk {
  constructor(_options?: any) {}

  async getMesh(): Promise<Mesh> {
    return await this.loadModel();
  }

  async loadModel(): Promise<Mesh> {
    // Promise
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load(treeTrunkModel, (gltf) => {
        const trunkMesh = gltf.scene.children[0].children[0] as Mesh;
        resolve(trunkMesh);
      });
    });
  }
}
