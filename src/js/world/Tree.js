import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export default class Tree {
  constructor(_options) {
    this.container = new THREE.Object3D();

    this.loadMaterial();
    this.loadModel();
  }

  loadMaterial() {
    const loader = new THREE.TextureLoader();
    loader.load("../../assets/textures/pine_tree.png", (texture) => {
      this.material = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.5,
      });
    });
  }

  loadModel() {
    const loader = new FBXLoader();
    loader.load("../../assets/resources/pine_tree.fbx", (object) => {
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
