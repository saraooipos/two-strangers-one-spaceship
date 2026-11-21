// Small, dependency-free capability checks used before loading the scene.

export function hasWebGL({ documentRef = globalThis.document, windowRef = globalThis.window } = {}) {
  if (!documentRef || !windowRef || !windowRef.WebGLRenderingContext) return false;

  try {
    const canvas = documentRef.createElement('canvas');
    return Boolean(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

export function prefersReducedMotion({ windowRef = globalThis.window } = {}) {
  return Boolean(windowRef?.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);
}

export function deviceTier({ windowRef = globalThis.window, navigatorRef = globalThis.navigator } = {}) {
  const memory = Number(navigatorRef?.deviceMemory) || 4;
  const cores = Number(navigatorRef?.hardwareConcurrency) || 4;
  const narrowViewport = Number(windowRef?.innerWidth) > 0 && Number(windowRef.innerWidth) < 600;

  if (memory <= 2 || cores <= 2 || narrowViewport) return 'low';
  if (memory >= 8 && cores >= 8) return 'high';
  return 'medium';
}

export function getSceneCapabilities(options = {}) {
  const reducedMotion = prefersReducedMotion(options);
  const tier = deviceTier(options);
  const particleCount = tier === 'low' ? 90 : tier === 'high' ? 260 : 170;

  return {
    webgl: hasWebGL(options),
    reducedMotion,
    tier,
    particleCount,
    renderLoop: !reducedMotion,
  };
}
