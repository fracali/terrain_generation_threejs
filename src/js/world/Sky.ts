import {
  BackSide,
  Color,
  HemisphereLight,
  Mesh,
  Object3D,
  Scene,
  ShaderMaterial,
  SphereGeometry,
} from "three";
// @ts-ignore
import skyFragmentShader from "../../shaders/sky/sky_fragment.glsl";
// @ts-ignore
import skyVertexShader from "../../shaders/sky/sky_vertex.glsl";
import Constants from "../Constants";
import HemiLight from "../lights/HemiLight";

export default class {
  container: Object3D;

  constructor(private scene: Scene, private terrainNoise: Uint8Array) {
    this.container = new Object3D();
    if (!this.scene) return;
    if (!this.scene.fog) return;

    const vertexShader = skyVertexShader;
    const fragmentShader = skyFragmentShader;
    const uniforms = {
      topColor: { value: new Color(0x71a8d6) },
      bottomColor: { value: new Color(0xe0ecf5) },
      offset: { value: 0 }, // Altezza gradient
      exponent: { value: 1 },
    };

    // Copia di hemiLight in world/index.js
    const hemiLight = new HemiLight(this.terrainNoise, {}).container
      .children[0] as HemisphereLight;
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    uniforms["topColor"].value.copy(hemiLight.color);

    this.scene.fog.color.copy(uniforms["bottomColor"].value);

    const skyGeo = new SphereGeometry(Constants.skyRadius, 32, 15);
    const skyMat = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: BackSide,
    });
    //const skyMat = new MeshStandardMaterial({ color: 0x3f88c5 });

    const sky = new Mesh(skyGeo, skyMat);
    this.container.add(sky);
  }
}
