function normalizeTarget(target) {
  return String(target || "").replace(/^\/+/, "");
}

export function buildAppUrl(target) {
  return new URL(normalizeTarget(target), window.location.href).toString();
}

export function buildAppPath(target) {
  const url = new URL(normalizeTarget(target), window.location.href);
  return `${url.pathname}${url.search}${url.hash}`;
}
