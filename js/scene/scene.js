import * as THREE from 'three';
import { getSceneCapabilities } from './capability.js';
import { createStarfield } from './starfield.js';
import { createNebula } from './nebula.js';
import { createPlanet } from './planet.js';
import { createShip } from './ship.js';

export function createSceneEnvironment({
  container = globalThis.document?.getElementById('scene-root'),
  documentRef = globalThis.document,
  windowRef = globalThis.window,
  onFallback = () => {},
} = {}) {
  let renderer;
  let frameId;
  let destroyed = false;
  let failed = false;
  let onResize;
  let onVisibility;

  const cleanup = () => {
    if (frameId !== undefined) windowRef?.cancelAnimationFrame?.(frameId);
    if (onResize) windowRef?.removeEventListener?.('resize', onResize);
    if (onVisibility) documentRef?.removeEventListener?.('visibilitychange', onVisibility);
    renderer?.dispose?.();
    renderer?.domElement?.remove();
  };

  const fallback = (reason) => {
    if (failed || destroyed) return;
    failed = true;
    cleanup();
    onFallback(reason);
  };

  if (!container) return { destroy() { destroyed = true; cleanup(); } };

  const capabilities = getSceneCapabilities({ documentRef, windowRef, navigatorRef: windowRef?.navigator });
  if (!capabilities.webgl) {
    fallback('webgl-unavailable');
    return { capabilities, destroy() { destroyed = true; cleanup(); } };
  }

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(windowRef?.devicePixelRatio || 1, 1.5));
    renderer.setSize(windowRef?.innerWidth || 1, windowRef?.innerHeight || 1, false);
    renderer.domElement.className = 'scene-canvas';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    container.append(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080b27);
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    scene.add(new THREE.AmbientLight(0x98aaff, 1.15));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(-4, 6, 8);
    scene.add(keyLight);

    const starfield = createStarfield(THREE, { count: capabilities.particleCount });
    const nebula = createNebula(THREE, { documentRef });
    const planet = createPlanet(THREE);
    const ship = createShip(THREE);
    scene.add(starfield, nebula, planet, ship);

    const resize = () => {
      if (destroyed || failed) return;
      const width = windowRef?.innerWidth || 1;
      const height = windowRef?.innerHeight || 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(windowRef?.devicePixelRatio || 1, 1.5));
      renderFrame(0);
    };

    const renderFrame = (time) => {
      if (destroyed || failed) return;
      try {
        if (!capabilities.reducedMotion) {
          const seconds = time / 1000;
          planet.rotation.y = seconds * 0.08;
          ship.position.y = -1.25 + Math.sin(seconds * 0.7) * 0.06;
          starfield.rotation.y = seconds * 0.004;
        }
        renderer.render(scene, camera);
      } catch (error) {
        fallback('renderer-error');
        return;
      }
      if (capabilities.renderLoop && !documentRef?.hidden) {
        frameId = windowRef?.requestAnimationFrame?.(renderFrame);
      }
    };

    onResize = resize;
    onVisibility = () => {
      if (documentRef?.hidden) {
        if (frameId !== undefined) windowRef?.cancelAnimationFrame?.(frameId);
        frameId = undefined;
      } else if (capabilities.renderLoop && !destroyed) {
        frameId = windowRef?.requestAnimationFrame?.(renderFrame);
      } else {
        renderFrame(0);
      }
    };
    windowRef?.addEventListener?.('resize', onResize, { passive: true });
    documentRef?.addEventListener?.('visibilitychange', onVisibility);
    resize();
    renderFrame(0);
  } catch (error) {
    fallback('renderer-error');
  }

  return {
    capabilities,
    destroy() {
      destroyed = true;
      cleanup();
    },
  };
}
