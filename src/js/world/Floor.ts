import { Mesh, MeshStandardMaterial, Object3D, PlaneGeometry } from "three";
import Constants from "../Constants";
import FloorMaterial from "../materials/terrain_mat";
import Time from "../utils/Time";
import TerrainNoise from "./TerrainNoise";

export default class Floor {
  private time = new Time();

  constructor(
    public container: Object3D = new Object3D(),
    private worldWidthRes: number = Constants.terrainWidthRes,
    private worldDepthRes: number = Constants.terrainDepthRes,
    private heightIntensity: number = Constants.terrainHeightIntensity,
    private geometry?: PlaneGeometry,
    private material: MeshStandardMaterial = FloorMaterial(),
    private mesh?: Mesh
  ) {
    // Geometry
    this.geometry = new PlaneGeometry(
      Constants.terrainWidth,
      Constants.terrainDepth,
      this.worldWidthRes - 1,
      this.worldDepthRes - 1
    );
    this.geometry.rotateX(-Math.PI / 2);
    this.geometry.translate(
      Constants.terrainWidth / 2,
      0,
      Constants.terrainDepth / 2
    );

    // Mesh
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.time.on("tick", () => {
      this.generateTerrain();

      this.mesh!.geometry.attributes.position.needsUpdate = true;

      this.mesh!.geometry.computeVertexNormals();
    });

    this.container.add(this.mesh);
  }

  generateTerrain() {
    const noiseInstance = TerrainNoise.getInstance();

    // @ts-ignore
    const vertices = this.geometry.attributes.position.array;
    for (let i = 0, l = vertices.length; i < l; i++) {
      // @ts-ignore
      this.geometry.attributes.position.setY(
        i,
        noiseInstance.getNoiseData()[i] * this.heightIntensity
      );
    }
  }
}
