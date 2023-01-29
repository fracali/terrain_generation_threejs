import * as THREE from "three";

export default function () {
  const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
  material.color.setHSL(0.095, 1, 0.75);

  return material;
}
