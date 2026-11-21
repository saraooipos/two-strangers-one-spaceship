import test from 'node:test';
import assert from 'node:assert/strict';
import { getSceneCapabilities, hasWebGL } from '../../js/scene/capability.js';

function browser({ webgl = true, reducedMotion = false, width = 1440 } = {}) {
  return {
    WebGLRenderingContext: webgl ? function WebGLRenderingContext() {} : undefined,
    innerWidth: width,
    matchMedia: () => ({ matches: reducedMotion }),
  };
}

function documentRef({ webgl = true } = {}) {
  return {
    createElement: () => ({
      getContext: () => webgl ? {} : null,
    }),
  };
}

test('capability selection chooses CSS fallback when WebGL is unavailable', () => {
  assert.equal(hasWebGL({ windowRef: browser({ webgl: false }), documentRef: documentRef({ webgl: false }) }), false);
  assert.equal(getSceneCapabilities({ windowRef: browser({ webgl: false }), documentRef: documentRef({ webgl: false }) }).webgl, false);
});

// **Validates: Requirements 2.5, 2.6**
test('capability selection uses one static frame for reduced motion', () => {
  const capabilities = getSceneCapabilities({
    windowRef: browser({ reducedMotion: true }),
    documentRef: documentRef(),
    navigatorRef: { deviceMemory: 8, hardwareConcurrency: 8 },
  });

  assert.equal(capabilities.reducedMotion, true);
  assert.equal(capabilities.renderLoop, false);
  assert.equal(capabilities.webgl, true);
});

test('capability selection lowers the particle budget on small devices', () => {
  const capabilities = getSceneCapabilities({
    windowRef: browser({ width: 390 }),
    documentRef: documentRef(),
    navigatorRef: { deviceMemory: 2, hardwareConcurrency: 2 },
  });

  assert.equal(capabilities.tier, 'low');
  assert.equal(capabilities.particleCount, 90);
});
