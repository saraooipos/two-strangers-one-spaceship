const PALETTES = {
  opening: { surface: 0x5b4ddd, atmosphere: 0x2de2d0 },
  contact: { surface: 0x3da9ff, atmosphere: 0x8b7dff },
  translation: { surface: 0xd56cff, atmosphere: 0x2de2d0 },
  heist: { surface: 0xffa45b, atmosphere: 0x3da9ff },
  memory: { surface: 0x8b7dff, atmosphere: 0x2de2d0 },
  destination: { surface: 0x2de2d0, atmosphere: 0x3da9ff },
};

export function createPlanet(THREE, paletteName = 'opening') {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(2.15, 32, 20),
    new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.08 }),
  );
  mesh.userData.paletteName = paletteName;
  applyPlanetPalette(mesh, paletteName);
  mesh.position.set(3.4, 0.9, -2.5);
  return mesh;
}

export function applyPlanetPalette(mesh, paletteName = 'opening') {
  const palette = PALETTES[paletteName] || PALETTES.opening;
  mesh.material.color.setHex(palette.surface);
  mesh.material.emissive.setHex(palette.atmosphere);
  mesh.material.emissiveIntensity = 0.16;
  mesh.userData.paletteName = paletteName;
  return mesh;
}

export { PALETTES };
