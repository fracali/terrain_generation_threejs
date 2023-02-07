import alea from "alea";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";
import Constants from "../Constants";
import Time from "../utils/Time";
import { map } from "../utils/map";

export default class TerrainNoise {
  private static instance: TerrainNoise;
  private noiseData: Uint8Array;
  private time = new Time();
  private positionOffset = 0;
  private rng = alea("B");
  private simplexNoise2D = createNoise2D(this.rng);
  private noise2D = this.fbm2d(this.simplexNoise2D, 2);

  private constructor() {
    this.noiseData = this.generateNoise(
      Constants.terrainWidthRes,
      Constants.terrainDepthRes
    );
    this.moveNoise();
  }

  public getOffset(): number {
    return this.positionOffset;
  }

  private fbm2d(noise2D: NoiseFunction2D, octaves: number): NoiseFunction2D {
    return function fbm2dFn(x: number, y: number) {
      let value = 0.0;
      let amplitude = 0.5;
      for (let i = 0; i < octaves; i++) {
        value += noise2D(x, y) * amplitude;
        x *= 0.5;
        y *= 0.5;
        amplitude *= 0.8;
      }
      return value;
    };
  }

  public getNoiseData(): Uint8Array {
    return this.noiseData;
  }

  public static getInstance(): TerrainNoise {
    if (!TerrainNoise.instance) {
      TerrainNoise.instance = new TerrainNoise();
    }

    return TerrainNoise.instance;
  }

  private moveNoise() {
    this.time.on("tick", () => {
      this.positionOffset += 0.5;
      this.noiseData = this.generateNoise(
        Constants.terrainWidthRes,
        Constants.terrainDepthRes
      );
    });
  }

  private generateNoise(width: number, height: number): Uint8Array {
    //console.log("Generating noise...");
    const size = width * height;
    const data = new Uint8Array(size);

    let quality = 1;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width,
          y = ~~(i / width) + this.positionOffset;
        data[i] += Math.abs(
          this.noise2D(x / quality, y / quality) * quality * 1.75
        );
      }

      quality *= 5;
    }

    return data;
  }

  // TODO: interpolare i valori per avere un risultato più fluido
  getNoiseValueAtPosition(x: number, y: number): number {
    let xAsRes = Math.floor(
      map(x, 0, Constants.terrainWidth, 0, Constants.terrainWidthRes)
    );
    let yAsRes = Math.floor(
      map(y, 0, Constants.terrainDepth, 0, Constants.terrainDepthRes)
    );

    const index = xAsRes + yAsRes * Constants.terrainWidthRes;

    // Per i valori vicini alla fine del terreno
    if (index > this.noiseData.length - 1) {
      return -100;
    }

    return this.noiseData[index];
  }
}
