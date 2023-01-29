import * as THREE from "three";
import FloorMaterial from "../materials/floor_mat";

export default class Floor {
  constructor(_options) {
    // Container
    this.container = new THREE.Object3D();

    // Geometry
    this.geometry = new THREE.PlaneGeometry(10000, 10000);

    // Material
    this.material = FloorMaterial();

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.container.add(this.mesh);
  }
}
