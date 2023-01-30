import * as THREE from "three";
import Constants from "../Constants";
import FloorMaterial from "../materials/floor_mat";

export default class Floor {
  constructor(_options) {
    this.worldWidth = Constants.worldWidth;
    this.worldDepth = Constants.worldDepth;

    this.heightIntensity = Constants.terrainHeightIntensity;

    // Container
    this.container = new THREE.Object3D();

    // Geometry
    this.geometry = new THREE.PlaneGeometry(
      5000,
      5000,
      this.worldWidth - 1,
      this.worldDepth - 1
    );
    this.geometry.rotateX(-Math.PI / 2);

    // Material
    this.material = FloorMaterial();

    // Mesh
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.data = _options.terrainNoise;
    this.generateTerrain();

    this.container.add(this.mesh);
  }

  generateTerrain() {
    const vertices = this.geometry.attributes.position.array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      this.geometry.attributes.position.setY(
        i,
        this.data[i] * this.heightIntensity - this.heightIntensity * 50
      );
    }
  }
}
