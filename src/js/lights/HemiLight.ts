import { HemisphereLight, HemisphereLightHelper, Object3D } from "three";
import Constants from "../Constants";
import TerrainNoise from "../world/TerrainNoise";

export default class {
  container: Object3D;
  private addHemiLightHelper: boolean;

  constructor({ addHemiLightHelper = false }) {
    this.addHemiLightHelper = addHemiLightHelper;
    this.container = new Object3D();

    const worldCenterX = Constants.terrainWidth / 2;
    const worldCenterZ = Constants.terrainDepth / 2;
    const noiseInstance = TerrainNoise.getInstance();
    const noiseHeight = noiseInstance.getNoiseValueAtPosition(
      worldCenterX,
      worldCenterZ
    );

    const hemiLight = new HemisphereLight(0xffeeb1, 0x080820, 1);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(
      0,
      noiseHeight * Constants.terrainHeightIntensity,
      0
    );
    this.container.add(hemiLight);

    if (this.addHemiLightHelper) {
      const hemiLightHelper = new HemisphereLightHelper(hemiLight, 10);
      this.container.add(hemiLightHelper);
    }
  }
}
