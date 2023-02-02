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

    console.log("noise at supposed tree location", data[100]);
    console.log("all noise", data);
    return data;
  }

  getNoiseValueAtPosition(noise: Uint8Array, x: number, y: number): number {
    let xAsRes = Math.round(
      map(x, 0, Constants.terrainWidth, 0, Constants.terrainWidthRes)
    );
    let yAsRes = Math.round(
      map(y, 0, Constants.terrainDepth, 0, Constants.terrainDepthRes)
    );

    const index = xAsRes + yAsRes * Constants.terrainWidthRes;

    // Per i valori vicini alla fine del terreno
    if (index > noise.length - 1) {
      console.log("fallback");
      return noise[noise.length - 1];
    }

    console.log("x", x);
    console.log("xAsRes", xAsRes);
    console.log("y", y);
    console.log("yAsRes", yAsRes);
    console.log("index", index);

    return noise[index];

    /* let xAsRes = Math.round(
      map(x, 0, Constants.terrainWidth, 0, Constants.terrainWidthRes)
    );
    let yAsRes = Math.round(
      map(y, 0, Constants.terrainDepth, 0, Constants.terrainDepthRes)
    );

    console.log("xAsRes", xAsRes);
    console.log("yAsRes", yAsRes);
    let index = xAsRes + yAsRes * (Constants.terrainWidthRes - 1);

    console.log("index", index);

    return noise[index]; */
  }
}
