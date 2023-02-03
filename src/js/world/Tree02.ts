import { Material, Mesh, MeshToonMaterial } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// @ts-ignore
import treeModel from "../../assets/resources/tree02.fbx?url";

export default class Tree02 {
  constructor(_options?: any, private material?: MeshToonMaterial) {}

  async getTree(): Promise<Mesh> {
    // Promise
    return new Promise((resolve) => {
      const loader = new FBXLoader();
      loader.load(treeModel, (object) => {
        //object.scale.setScalar(0.08);
        object.traverse((child) => {
          let childMesh = <Mesh>child;

          if ((<Mesh>child).isMesh) {
            const geometry = childMesh.geometry;
            geometry.computeVertexNormals();
            geometry.scale(0.5, 0.5, 0.5);

            if (childMesh.material && this.material) {
              (<Material>childMesh.material) = this.material;
            }
            childMesh.castShadow = true;
            childMesh.receiveShadow = true;
          }

          resolve(childMesh);
        });
      });
    });
  }
}
