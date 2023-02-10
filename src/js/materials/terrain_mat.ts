import { MeshStandardMaterial } from "three";

export default function (): MeshStandardMaterial {
  const material = new MeshStandardMaterial({
    color: 0xff6a7638,
    wireframe: false,
    roughness: 0.8,
    metalness: 0.01,
  });

  return material;
}
