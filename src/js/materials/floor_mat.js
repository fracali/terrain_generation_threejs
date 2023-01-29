import * as THREE from "three";

export default function () {
  const material = new THREE.MeshPhongMaterial({
    color: 0xff0000,
    side: THREE.DoubleSide,
  });

  return material;
}
