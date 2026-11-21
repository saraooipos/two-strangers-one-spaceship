// Plain-text DOM helpers. Every string goes in through textContent, never innerHTML (Req 14.9).

export function el(tag, text, attrs) {
  const node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = String(text);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  }
  return node;
}

export function clear(node) {
  node.replaceChildren();
  return node;
}

export function mount(root, ...children) {
  clear(root).append(...children);
  return root;
}
