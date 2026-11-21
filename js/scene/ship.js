export function createShip(THREE) {
  const ship = new THREE.Group();
  ship.position.set(-1.4, -1.25, 0);
  ship.rotation.z = -0.08;

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.58, 1.9, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xd8e7ff, metalness: 0.72, roughness: 0.3 }),
  );
  body.rotation.z = Math.PI / 2;
  ship.add(body);

  const cockpit = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x2de2d0, emissive: 0x145c69, emissiveIntensity: 0.55, metalness: 0.25, roughness: 0.22 }),
  );
  cockpit.position.set(0.68, 0.18, 0);
  cockpit.scale.set(1.25, 0.65, 0.85);
  ship.add(cockpit);

  const wingMaterial = new THREE.MeshStandardMaterial({ color: 0x5b4ddd, metalness: 0.55, roughness: 0.4 });
  for (const side of [-1, 1]) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.08, 0.62), wingMaterial);
    wing.position.set(-0.12, 0, side * 0.62);
    wing.rotation.x = side * 0.12;
    ship.add(wing);
  }

  const engine = new THREE.PointLight(0x3da9ff, 1.5, 3.5);
  engine.position.set(-1.05, 0, 0);
  ship.add(engine);

  return ship;
}
