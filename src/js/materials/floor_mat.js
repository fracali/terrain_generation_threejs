import { MeshStandardMaterial } from "three";

export default function () {
  const material = new MeshStandardMaterial({ color: 0xffffff });
  material.color.setHex(0xff8dcb72);
  material.depthWrite = true;

  return material;
}
