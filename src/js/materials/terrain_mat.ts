import { MeshStandardMaterial } from "three";

export default function (): MeshStandardMaterial {
  const material = new MeshStandardMaterial({
    color: 0xff8dcb72,
    roughness: 0.8,
    metalness: 0.01,
  });
  material.depthWrite = true;

  return material;
}
