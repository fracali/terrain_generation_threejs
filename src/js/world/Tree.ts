import {
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  TextureLoader,
} from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// @ts-ignore
import treeModel from "../../assets/resources/pine_tree.fbx?url";
// @ts-ignore
import treeTexture from "../../assets/textures/pine_tree.png?url";

export default class Tree {
  constructor(
    _options?: any,
    public container: Object3D = new Object3D(),
    private material?: MeshStandardMaterial
  ) {
    this.loadMaterialThenModel();
  }

  loadMaterialThenModel() {
    const loader = new TextureLoader();
    loader.load(treeTexture, (texture) => {
      this.material = new MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
      });

      // Carica il modello solo dopo aver caricato il materiale
      this.loadModel();
    });
  }

  loadModel() {
    const loader = new FBXLoader();
    loader.load(treeModel, (object) => {
      object.scale.setScalar(0.08);
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
      });

      this.container.add(object);
    });
  }
}
