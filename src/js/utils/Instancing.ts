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
  private object: Mesh;
  private surface: Object3D;
  private instances: number;
  private noise: Uint8Array;
  private scene: Scene;
  private minScale: number;
  private maxScale: number;
  private xRotationCompensation: number;
  private yRotationCompensation: number;
  private zRotationCompensation: number;
  private xRandomRotation?: boolean;
  private yRandomRotation?: boolean;
  private zRandomRotation?: boolean;

  container: Object3D;
  surfaceSize: Box3;
  terrainNoise: TerrainNoise = new TerrainNoise();

  constructor({
    object,
    surface,
    instances,
    noise,
    scene,
    minScale = 0.5,
    maxScale = 1,
    xRotationCompensation = 0,
    yRotationCompensation = 0,
    zRotationCompensation = 0,
    xRandomRotation = false,
    yRandomRotation = false,
    zRandomRotation = false,
  }: {
    object: Mesh;
    surface: Object3D;
    instances: number;
    noise: Uint8Array;
    scene: Scene;
    minScale?: number;
    maxScale?: number;
    xRotationCompensation?: number;
    yRotationCompensation?: number;
    zRotationCompensation?: number;

    xRandomRotation?: boolean;
    yRandomRotation?: boolean;
    zRandomRotation?: boolean;
  }) {
    this.object = object;
    this.surface = surface;
    this.instances = instances;
    this.noise = noise;
    this.scene = scene;
    this.minScale = minScale;
    this.maxScale = maxScale;
    this.xRotationCompensation = xRotationCompensation;
    this.yRotationCompensation = yRotationCompensation;
    this.zRotationCompensation = zRotationCompensation;
    this.xRandomRotation = xRandomRotation;
    this.yRandomRotation = yRandomRotation;
    this.zRandomRotation = zRandomRotation;

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
    const scale = new Vector3();

    const randomGlobalScale =
      Math.random() * (this.maxScale - this.minScale) + this.minScale;

    scale.x = randomGlobalScale;
    scale.y = randomGlobalScale;
    scale.z = randomGlobalScale;

    return scale;
  }

  getInstanceRotation(): Euler {
    const rotation = new Euler();

    const xRandomRotation: number = this.xRandomRotation
      ? Math.random() * Math.PI * 2
      : 0;
    const yRandomRotation: number = this.yRandomRotation
      ? Math.random() * Math.PI * 2
      : 0;
    const zRandomRotation: number = this.zRandomRotation
      ? Math.random() * Math.PI * 2
      : 0;

    rotation.x = xRandomRotation + this.xRotationCompensation;
    rotation.y = yRandomRotation + this.yRotationCompensation;
    rotation.z = zRandomRotation + this.zRotationCompensation;

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
