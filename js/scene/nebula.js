export function createNebula(THREE, { documentRef = globalThis.document } = {}) {
  if (!documentRef) return new THREE.Group();

  const canvas = documentRef.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 128, 8, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(45, 226, 208, 0.34)');
  gradient.addColorStop(0.45, 'rgba(91, 77, 221, 0.2)');
  gradient.addColorStop(1, 'rgba(11, 16, 48, 0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    opacity: 0.9,
  }));
  sprite.scale.set(18, 10, 1);
  sprite.position.set(-2, 2, -7);

  return sprite;
}
