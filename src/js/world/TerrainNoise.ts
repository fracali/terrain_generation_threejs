import ImprovedNoise from "improved-noise";
import Constants from "../Constants";

export default class TerrainNoise {
  getNoise(width: number, height: number): Uint8Array {
    console.log("getNoise", width, height);
    const size = width * height;
    const data = new Uint8Array(size);
    const perlin = new ImprovedNoise();
    const z = Math.random() * 100;

    let quality = 1;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width,
          y = ~~(i / width);
        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        );
      }

      quality *= 5;
    }

    console.log("data", data);
    return data;
  }

  getNoiseValueAtPosition(
    noise: Uint8Array,
    x: number,
    y: number,
    width: number,
    height: number
  ): number {
    x = x + width / 2;
    y = y + height / 2;

    return noise[x + y * width] * Constants.terrainHeightIntensity;
  }
}
