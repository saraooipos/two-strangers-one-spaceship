export function createStarfield(THREE, { count = 170 } = {}) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const offset = index * 3;
    positions[offset] = (Math.random() - 0.5) * 32;
    positions[offset + 1] = (Math.random() - 0.5) * 20;
    positions[offset + 2] = (Math.random() - 0.5) * 18 - 4;
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xb9e8ff,
    size: 0.08,
    transparent: true,
    opacity: 0.82,
    sizeAttenuation: true,
  });

  return new THREE.Points(geometry, material);
}
