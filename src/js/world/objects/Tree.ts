import { Material, Mesh, MeshStandardMaterial, TextureLoader } from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// @ts-ignore
import treeModel from "../../../assets/resources/pine_tree.fbx?url";
// @ts-ignore
import treeTexture from "../../../assets/textures/pine_tree.png?url";

export default class Tree {
  constructor(_options?: any, private material?: MeshStandardMaterial) {}

  async getMesh(): Promise<Mesh> {
    return await this.loadMaterialThenModel();
  }

  async loadMaterialThenModel(): Promise<Mesh> {
    return new Promise((resolve) => {
      const loader = new TextureLoader();
      loader.load(treeTexture, async (texture) => {
        this.material = new MeshStandardMaterial({
          wireframe: true,
          transparent: false,
        });

        // Carica il modello solo dopo aver caricato il materiale
        const mesh = await this.loadModel();
        resolve(mesh);
      });
    });
  }

  async loadModel(): Promise<Mesh> {
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
