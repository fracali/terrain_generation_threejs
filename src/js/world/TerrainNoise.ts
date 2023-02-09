import alea from "alea";
import { NoiseFunction2D, createNoise2D } from "simplex-noise";
import Constants from "../Constants";
import Time from "../utils/Time";
import { map } from "../utils/map";

export default class TerrainNoise {
  private static instance: TerrainNoise;
  private noiseData: Float32Array;
  private time = new Time();
  private positionOffset = 0;
  private rng = alea("A");
  private simplexNoise2D = createNoise2D(this.rng);
  private noise2D = this.fbm2d(this.simplexNoise2D);

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

  private fbm2d(noise2D: NoiseFunction2D): NoiseFunction2D {
    return function fbm2dFn(x: number, y: number) {
      return noise2D(x, y);
    };
  }

  public getNoiseData(): Float32Array {
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
      this.positionOffset += Constants.noiseSpeed; // Deve essere uguale a 1 per avere un movimento fluido
      this.noiseData = this.generateNoise(
        Constants.terrainWidthRes,
        Constants.terrainDepthRes
      );
    });
  }

  private generateNoise(width: number, height: number): Float32Array {
    const size = width * height;
    const data = new Float32Array(size);

    let quality = 1;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size; i++) {
        const x = i % width;
        const y = ~~(i / width) + this.positionOffset;
        data[i] += Math.abs(
          this.noise2D(x / quality, y / quality) * quality * 1.75
        );
      }

      quality *= 5;
    }

    return data;
  }

  // TODO: interpolare i valori per avere un risultato più fluido
  // getNoiseValueAtPosition(x: number, y: number): number {
  //   let xAsRes = Math.floor(
  //     map(x, 0, Constants.terrainWidth, 0, Constants.terrainWidthRes)
  //   );
  //   let yAsRes = Math.floor(
  //     map(y, 0, Constants.terrainDepth, 0, Constants.terrainDepthRes)
  //   );

  //   const index = xAsRes + yAsRes * Constants.terrainWidthRes;

  //   // Per i valori vicini alla fine del terreno
  //   if (index > this.noiseData.length - 1) {
  //     return -100;
  //   }

  //   return this.noiseData[index];
  // }

  public getNoiseValueAtPosition(x: number, y: number): number {
    let xAsRes = Math.floor(
      map(x, 0, Constants.terrainWidth, 0, Constants.terrainWidthRes)
    );
    let yAsRes = Math.floor(
      map(y, 0, Constants.terrainDepth, 0, Constants.terrainDepthRes)
    );


    // Se sta esattamente su un vertice
    return this.getAverageHeight(x, y, xAsRes, yAsRes);
  }

  private getHeightAtCell(cellX: number, cellY: number): number {
    const roundedIndex = cellX + cellY * Constants.terrainWidthRes;

    // Per i valori vicini alla fine del terreno
    if (roundedIndex > this.noiseData.length - 1) {
      return -100;
    }

    return this.noiseData[roundedIndex];
  }

  // TODO: blocca il render
  private getAverageHeight(
    x: number,
    y: number,
    cellX: number,
    cellY: number
  ): number {
    const cellSize = Constants.terrainWidth / Constants.terrainWidthRes;
    const xOnCell = x % cellSize;
    const yOnCell = y % cellSize;

    const topLeftH = this.getHeightAtCell(cellX, cellY);
    const topRightH = this.getHeightAtCell(cellX + cellSize, cellY);
    const bottomLeftH = this.getHeightAtCell(cellX, cellY + cellSize);
    const bottomRightH = this.getHeightAtCell(
      cellX + cellSize,
      cellY + cellSize
    );

    const avgHeightLeft = this.lerp(topLeftH, bottomLeftH, yOnCell);
    const avgHeightRight = this.lerp(topRightH, bottomRightH, yOnCell);
    const avgHeightTop = this.lerp(topLeftH, topRightH, xOnCell);
    const avgHeightBottom = this.lerp(bottomLeftH, bottomRightH, xOnCell);

    const avgHeightHorizontal = this.lerp(
      avgHeightLeft,
      avgHeightRight,
      xOnCell
    );
    const avgHeightVertical = this.lerp(avgHeightTop, avgHeightBottom, yOnCell);

    const avgHeight = this.lerp(avgHeightHorizontal, avgHeightVertical, 0.5);

    return avgHeight;
  }

  private lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end;
  }
}
