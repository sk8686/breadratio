const COPY_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
const SUCCESS_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';

export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function buildCopyText(entries, footer = '') {
  const lines = entries
    .filter(([label, value]) => label && value)
    .map(([label, value]) => `${label}: ${value}`);

  if (footer) {
    lines.push('', footer);
  }

  return lines.join('\n');
}

export function getCopyButtonMarkup(label, state = 'default') {
  return `${state === 'success' ? SUCCESS_ICON : COPY_ICON} ${escapeHtml(label)}`;
}

export function getHydrationDescriptionKey(hydration) {
  if (hydration <= 57) return 'veryStiff';
  if (hydration <= 65) return 'stiff';
  if (hydration <= 70) return 'standard';
  if (hydration <= 78) return 'high';
  if (hydration <= 85) return 'veryHigh';
  return 'extreme';
}
