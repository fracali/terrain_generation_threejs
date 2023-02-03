import {
  Box3,
  BufferGeometry,
  DynamicDrawUsage,
  Euler,
  InstancedMesh,
  Matrix4,
  Mesh,
  Object3D,
  Quaternion,
  Scene,
  Vector3,
} from "three";
import Constants from "../Constants";
import TerrainNoise from "../world/TerrainNoise";

export default class {
  container: Object3D;
  surfaceSize: Box3;
  terrainNoise: TerrainNoise = new TerrainNoise();

  constructor(
    private object: Mesh,
    private surface: Object3D,
    private instances: number,
    private noise: Uint8Array,
    private scene: Scene
  ) {
    this.container = new Object3D();
    this.surfaceSize = new Box3().setFromObject(this.surface);
  }

  doInstancing() {
    let geometry: BufferGeometry = // @ts-ignore
      this.object.children[0].geometry as BufferGeometry;

    // @ts-ignore
    const material = this.object.children[0].material;

    let mesh = new InstancedMesh(geometry, material, this.instances);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);

    const matrix = new Matrix4();
    if (this.surface === undefined) {
      return;
    }

    for (let i = 0; i < this.instances; i++) {
      const position = this.getInstancePosition();
      const rotation = this.getInstanceRotation();
      const quaternion = new Quaternion();
      const scale = this.getInstanceScale();

      quaternion.setFromEuler(rotation);

      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.updateMatrixWorld();

    // Shadows
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    this.scene.add(mesh);
  }

  getInstanceScale(): Vector3 {
    const minScale = 0.08;
    const maxScale = 0.15;

    const scale = new Vector3();

    const randomGlobalScale = Math.random() * (maxScale - minScale) + minScale;

    scale.x = randomGlobalScale;
    scale.y = randomGlobalScale;
    scale.z = randomGlobalScale;

    return scale;
  }

  getInstanceRotation(): Euler {
    const rotation = new Euler();

    rotation.y = Math.random() * Math.PI * 2;

    return rotation;
  }

  getInstancePosition(): Vector3 {
    const position = new Vector3();

    const surfaceWidth = this.surfaceSize.max.x;
    const surfaceDepth = this.surfaceSize.max.z;

    const x = Math.random() * surfaceWidth;
    const z = Math.random() * surfaceDepth;

    position.x = x;
    position.y =
      this.terrainNoise.getNoiseValueAtPosition(this.noise, x, z) *
      Constants.terrainHeightIntensity;
    position.z = z;

    return position;
  }
}
