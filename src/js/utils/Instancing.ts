import { Box3, Mesh, Object3D } from "three";
import Constants from "../Constants";
import TerrainNoise from "../world/TerrainNoise";

export default class {
  container: Object3D;

  constructor(
    private object: Function,
    private surface: Object3D,
    private instances: number,
    private noise: Uint8Array
  ) {
    this.container = new Object3D();

    this.makeInstancing();
  }

  makeInstancing() {
    const surfaceSize = new Box3().setFromObject(this.surface);
    console.log("geometry size", surfaceSize);

    const surfaceWidth = surfaceSize.max.x;
    const surfaceDepth = surfaceSize.max.z;

    let terrainNoise = new TerrainNoise();

    for (let i = 0; i < this.instances; i++) {
      const x = surfaceWidth * Math.random();
      const z = surfaceDepth * Math.random();

      this.addInstance(
        this.object,
        x,
        terrainNoise.getNoiseValueAtPosition(this.noise, x, z) *
          Constants.terrainHeightIntensity,
        z
      );
    }
  }

  addInstance(objectBuilder: Function, x: number, y: number, z: number) {
    const instance = objectBuilder();
    if (!instance) {
      return;
    }

    const instanceMesh = instance.container as Mesh;

    instanceMesh.position.set(x, y, z);
    this.container.add(instanceMesh);
  }
}
