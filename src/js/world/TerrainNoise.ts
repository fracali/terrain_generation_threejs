import ImprovedNoise from "improved-noise";
import Constants from "../Constants";
import { map } from "../utils/map";

export default class TerrainNoise {
  getNoise(width: number, height: number): Uint8Array {
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

    return data;
  }

  getNoiseValueAtPosition(noise: Uint8Array, x: number, y: number): number {
    let xAsRes = Math.floor(
      map(x, 0, Constants.terrainWidth, 0, Constants.terrainWidthRes)
    );
    let yAsRes = Math.floor(
      map(y, 0, Constants.terrainDepth, 0, Constants.terrainDepthRes)
    );

    const index = xAsRes + yAsRes * Constants.terrainWidthRes;

    // Per i valori vicini alla fine del terreno
    if (index > noise.length - 1) {
      return -100;
    }

    return noise[index];
  }
}
