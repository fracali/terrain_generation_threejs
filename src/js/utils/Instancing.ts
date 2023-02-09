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
import Time from "./Time";

export default class {
  private object: Mesh;
  private surface: Object3D;
  private instances: number;
  private scene: Scene;
  private minScale: number;
  private maxScale: number;
  private xRotationCompensation: number;
  private yRotationCompensation: number;
  private zRotationCompensation: number;
  private xRandomRotation?: boolean;
  private yRandomRotation?: boolean;
  private zRandomRotation?: boolean;
  private isDynamic: boolean = false;
  private time = new Time();

  private instancedMesh?: InstancedMesh;
  private instancePositionOffset =
    Constants.noiseSpeed * (Constants.terrainDepth / Constants.terrainDepthRes);

  container: Object3D;
  surfaceSize: Box3;
  terrainNoise: TerrainNoise = TerrainNoise.getInstance();

  constructor({
    object,
    surface,
    instances,
    scene,
    minScale = 0.5,
    maxScale = 1,
    xRotationCompensation = 0,
    yRotationCompensation = 0,
    zRotationCompensation = 0,
    xRandomRotation = false,
    yRandomRotation = false,
    zRandomRotation = false,
    isDynamic = false,
  }: {
    object: Mesh;
    surface: Object3D;
    instances: number;
    scene: Scene;
    minScale?: number;
    maxScale?: number;
    xRotationCompensation?: number;
    yRotationCompensation?: number;
    zRotationCompensation?: number;
    xRandomRotation?: boolean;
    yRandomRotation?: boolean;
    zRandomRotation?: boolean;
    isDynamic?: boolean;
  }) {
    this.object = object;
    this.surface = surface;
    this.instances = instances;
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
    this.isDynamic = isDynamic;

    if (this.isDynamic) {
      this.time.on("tick", () => {
        this.updateInstances();
      });
    }
  }

  private updateInstances() {
    if (!this.instancedMesh) {
      return;
    }

    for (let i = 0; i < this.instances; i++) {
      const position = this.getUpdatedPosition(i);
      const rotation = this.getUpdatedRotation(i);
      const quaternion = new Quaternion();
      quaternion.setFromEuler(rotation);
      const scale = this.getUpdatedScale(i);

      const matrix = new Matrix4();
      matrix.compose(position, quaternion, scale);
      this.instancedMesh.setMatrixAt(i, matrix);
    }
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  private getUpdatedPosition(instanceIndex: number): Vector3 {
    if (!this.instancedMesh) {
      return new Vector3();
    }

    const oldMatrix = new Matrix4();
    this.instancedMesh.getMatrixAt(instanceIndex, oldMatrix);

    const oldPosition = new Vector3();
    oldPosition.setFromMatrixPosition(oldMatrix);

    const newX = oldPosition.x;
    const newZ = oldPosition.z - this.instancePositionOffset; // Deve avere lo stesso rapporto tra il numero di segmenti e la profondità del terreno
    const newY =
      this.terrainNoise.getNoiseValueAtPosition(newX, newZ) *
      Constants.terrainHeightIntensity;

    let newPosition = new Vector3(newX, newY, newZ);

    // Quando è uscito dal terreno gli assegna una nuova posizione casuale
    // ma alla fine del terreno
    if (oldPosition.z < 0) {
      newPosition = this.getInitialPosition();

      // Lo mette all'estremità del terreno
      newPosition.z = Constants.terrainDepth;
    }
    return newPosition;
  }

  private getUpdatedRotation(instanceIndex: number): Euler {
    if (!this.instancedMesh) {
      return new Euler();
    }

    const oldMatrix = new Matrix4();
    this.instancedMesh.getMatrixAt(instanceIndex, oldMatrix);

    let newRotation = new Euler();
    const oldRotation = new Euler();
    oldRotation.setFromRotationMatrix(oldMatrix);

    newRotation = oldRotation;

    return newRotation;
  }

  private getUpdatedScale(instanceIndex: number): Vector3 {
    if (!this.instancedMesh) {
      return new Vector3();
    }

    const oldMatrix = new Matrix4();
    this.instancedMesh.getMatrixAt(instanceIndex, oldMatrix);

    let newScale = new Vector3();
    const oldScale = new Vector3();
    oldScale.setFromMatrixScale(oldMatrix);

    // Se non è uscito dal terreno
    if (oldScale.z > 0) {
      newScale = oldScale;
    } else {
      newScale = this.getInitialScale();
    }

    return newScale;
  }

  doInstancing() {
    let geometry: BufferGeometry = // @ts-ignore
      this.object.children[0].geometry as BufferGeometry;

    // @ts-ignore
    const material = this.object.children[0].material;

    this.instancedMesh = new InstancedMesh(geometry, material, this.instances);
    this.instancedMesh.instanceMatrix.setUsage(DynamicDrawUsage);

    const matrix = new Matrix4();
    if (this.surface === undefined) {
      return;
    }

    for (let i = 0; i < this.instances; i++) {
      const position = this.getInitialPosition();
      const rotation = this.getInitialRotation();
      const quaternion = new Quaternion();
      const scale = this.getInitialScale();

      quaternion.setFromEuler(rotation);

      matrix.compose(position, quaternion, scale);
      this.instancedMesh.setMatrixAt(i, matrix);
    }
    this.instancedMesh.updateMatrixWorld();

    // Shadows
    this.instancedMesh.castShadow = true;
    this.instancedMesh.receiveShadow = true;

    this.scene.add(this.instancedMesh);
  }

  getInitialScale(): Vector3 {
    const scale = new Vector3();

    const randomGlobalScale =
      Math.random() * (this.maxScale - this.minScale) + this.minScale;

    scale.x = randomGlobalScale;
    scale.y = randomGlobalScale;
    scale.z = randomGlobalScale;

    return scale;
  }

  getInitialRotation(): Euler {
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

  getInitialPosition(): Vector3 {
    const position = new Vector3();

    const surfaceWidth = this.surfaceSize.max.x;
    const surfaceDepth = this.surfaceSize.max.z;

    const x = Math.random() * surfaceWidth;
    const z = Math.random() * surfaceDepth;

    position.x = x;
    position.y =
      this.terrainNoise.getNoiseValueAtPosition(x, z) * Constants.terrainHeightIntensity;
    position.z = z;

    return position;
  }
}
