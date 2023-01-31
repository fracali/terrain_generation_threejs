import { AxesHelper, DirectionalLight, DirectionalLightHelper, HemisphereLight, HemisphereLightHelper, Object3D } from "three";
import Tree from "./Tree";
import Floor from "./floor";

export default class World {
  constructor(_options) {
    // Options
    this.config = _options.config;
    this.resources = _options.resources;
    this.time = _options.time;
    this.sizes = _options.sizes;
    this.camera = _options.camera;
    this.renderer = _options.renderer;
    this.passes = _options.passes;
    this.terrainNoise = _options.terrainNoise;

    // Set up
    this.container = new Object3D();
    this.container.matrixAutoUpdate = false;

    this.setAxes();
    this.setLights();
    this.setFloor();
    this.addTree();
  }

  addTree() {
    /* const geometry = new SphereGeometry(1, 50, 50);
    geometry.translate(0, 2, 0);
    const material = new MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    this.container.add(cube); */

    /* const tree = new Tree();
    this.container.add(tree.container); */
  }

  setAxes() {
    this.axis = new AxesHelper();
    this.container.add(this.axis);
  }

  setLights() {
    const hemiLight = new HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    this.container.add(hemiLight);

    const hemiLightHelper = new HemisphereLightHelper(hemiLight, 10);
    this.container.add(hemiLightHelper);

    const dirLight = new DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    this.container.add(dirLight);

    dirLight.castShadow = true;

    // Qualità ombre
    dirLight.shadow.mapSize.width = 4096;
    dirLight.shadow.mapSize.height = 4096;

    const d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;

    const dirLightHelper = new DirectionalLightHelper(dirLight, 10);
    this.container.add(dirLightHelper);
  }

  setFloor() {
    this.floor = new Floor({ terrainNoise: this.terrainNoise });
    //this.floor.geometry.rotateX(Math.PI * -0.5);
    this.container.add(this.floor.container);
  }
}
