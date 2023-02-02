import { Box3, Object3D } from "three";

export default class {
  container: Object3D;

  constructor(
    private object: Object3D,
    private surface: Object3D,
    private instances: number
  ) {
    this.container = new Object3D();

    this.makeInstancing();
  }

  makeInstancing() {
    const surfaceSize = new Box3().setFromObject(this.surface);

    console.log("geometry size", surfaceSize);

    const surfaceWidth = surfaceSize.max.x;
    const surfaceDepth = surfaceSize.max.z;

    for (let i = 0; i < this.instances; i++) {
      this.addInstance(
        this.object,
        surfaceWidth * Math.random(),
        0,
        surfaceDepth * Math.random()
      );
    }
  }

  addInstance(object: Object3D, x: number, y: number, z: number) {
    const instance = object.clone();
    instance.position.set(x, y, z);
    this.container.add(instance);
  }
}
