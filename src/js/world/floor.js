import ImprovedNoise from "improved-noise";
import * as THREE from "three";
import FloorMaterial from "../materials/floor_mat";

export default class Floor {
  constructor(_options) {
    this.worldWidth = 512;
    this.worldDepth = 512;
    this.heightIntensity = 2;

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

    this.data = this.generateHeight(this.worldWidth, this.worldDepth);
    this.generateTerrain();

    this.container.add(this.mesh);
  }

  generateHeight(width, height) {
    /* let seed = Math.PI / 4;
    window.Math.random = function () {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }; */

    const size = width * height;
    const data = new Uint8Array(size);
    const perlin = ImprovedNoise();
    const z = Math.random() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width,
          y = ~~(i / width);
        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
      }

      quality *= 5;
    }

    return data;
  }

  generateTerrain() {
    const vertices = this.geometry.attributes.position.array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      this.geometry.attributes.position.setY(
        i,
        this.data[i] * this.heightIntensity - this.heightIntensity * 50
      );
      //vertices[j + 1] = this.data[i] * 10;
    }
  }
}
