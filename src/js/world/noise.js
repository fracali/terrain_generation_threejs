import ImprovedNoise from "improved-noise";

export default function (width, height) {
  const size = width * height;
  const data = new Uint8Array(size);
  const perlin = ImprovedNoise();
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
