import * as THREE from "three";

export default function () {
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  material.color.setHex(0xff8dcb72);
  material.depthWrite = true;

  return material;
}
