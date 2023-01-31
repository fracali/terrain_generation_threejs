import { Mesh, MeshStandardMaterial, Object3D, PlaneGeometry } from "three";
import Constants from "../Constants";
import FloorMaterial from "../materials/floor_mat";

export default class Floor {
  constructor(
    private terrainNoise: Uint8Array,
    public container: Object3D = new Object3D(),
    private worldWidth: number = Constants.worldWidth,
    private worldDepth: number = Constants.worldDepth,
    private heightIntensity: number = Constants.terrainHeightIntensity,
    private geometry?: PlaneGeometry,
    private material: MeshStandardMaterial = FloorMaterial(),
    private mesh?: Mesh
  ) {
    // Geometry
    this.geometry = new PlaneGeometry(
      5000,
      5000,
      this.worldWidth - 1,
      this.worldDepth - 1
    );
    this.geometry.rotateX(-Math.PI / 2);

    // Mesh
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.generateTerrain();

    this.container.add(this.mesh);
  }

  generateTerrain() {
    // @ts-ignore
    const vertices = this.geometry.attributes.position.array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      // @ts-ignore
      this.geometry.attributes.position.setY(
        i,
        this.terrainNoise[i] * this.heightIntensity - this.heightIntensity * 50
      );
    }
  }
}
