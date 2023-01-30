import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// @ts-ignore
import treeModel from "../../assets/resources/pine_tree.fbx?url";
// @ts-ignore
import treeTexture from "../../assets/textures/pine_tree.png?url";

export default class Tree {
  constructor(_options) {
    this.container = new THREE.Object3D();

    this.loadMaterial();
    this.loadModel();
  }

  loadMaterial() {
    const loader = new THREE.TextureLoader();
    loader.load(treeTexture, (texture) => {
      this.material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
      });
    });
  }

  loadModel() {
    const loader = new FBXLoader();
    loader.load(treeModel, (object) => {
      object.scale.setScalar(0.05);
      object.traverse((child) => {
        // @ts-ignore
        if (child.isMesh) {
          // @ts-ignore
          child.material = this.material;
          // @ts-ignore
          child.material.side = THREE.DoubleSide;
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.container.add(object);
    });
  }
}
