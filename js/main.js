// Boot and hash router. Visual environment is deliberately independent of screen input.
import { el, mount } from './render.js';
import { createSceneEnvironment } from './scene/scene.js';

const app = document.getElementById('app');
const sceneRoot = document.getElementById('scene-root');
let sceneEnvironment;

/** Parses location.hash into { name, param }. */
export function parseRoute(hash) {
  const path = (hash || '').replace(/^#/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'room' && parts[1]) return { name: 'room', param: decodeURIComponent(parts[1]) };
  if (parts[0] === 'join' && parts[1]) return { name: 'join', param: decodeURIComponent(parts[1]) };
  return { name: 'notfound' };
}

function panel(title, titleId, children) {
  const screen = el('section', undefined, { class: 'screen glass-panel opening-screen', 'aria-labelledby': titleId });
  screen.append(...children);
  return screen;
}

const screens = {
  home() {
    const screen = el('section', undefined, { class: 'screen glass-panel opening-screen', 'aria-labelledby': 'opening-title' });
    screen.append(
      el('p', 'DEEP SPACE // QUESTIONABLE DECISIONS', { class: 'eyebrow' }),
      el('h1', 'TWO STRANGERS, ONE SPACESHIP', { id: 'opening-title' }),
      el('p', 'Two people. One questionable spaceship. An alarming number of bad decisions.', { class: 'tagline' }),
    );
    const start = el('button', 'Start the adventure', { id: 'start-adventure', type: 'button' });
    const note = el('p', 'No registration. Just a ship, a friend and several avoidable consequences.', { class: 'start-note', id: 'start-note' });
    start.addEventListener('click', () => {
      note.textContent = 'The launch console is ready. Room setup is coming next.';
      start.focus();
    });
    screen.append(start, note);
    return screen;
  },
  room(route) {
    return panel('Room', 'room-title', [
      el('h2', 'Room', { id: 'room-title' }),
      el('p', `Placeholder for room ${route.param}.`),
    ]);
  },
  join() {
    return panel('Join', 'join-title', [
      el('h2', 'Join', { id: 'join-title' }),
      el('p', 'Placeholder: joining with an invitation link.'),
    ]);
  },
  notfound() {
    return panel('Lost in space', 'notfound-title', [
      el('h2', 'Lost in space', { id: 'notfound-title' }),
      el('p', 'There is nothing at this address.'),
      el('a', 'Back to the start', { href: '#/', class: 'button' }),
    ]);
  },
};

function render() {
  const route = parseRoute(window.location.hash);
  mount(app, screens[route.name](route));
  app.focus();
}

function startScene() {
  sceneEnvironment = createSceneEnvironment({
    container: sceneRoot,
    onFallback: () => sceneRoot.classList.add('fallback-active'),
  });
}

window.addEventListener('hashchange', render);
render();
// Let the text-first opening screen paint before the optional renderer starts.
window.requestAnimationFrame(startScene);

export { startScene };
