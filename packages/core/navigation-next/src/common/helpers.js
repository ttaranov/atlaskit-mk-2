// @flow
export function applyDisabledProperties(disableInteraction: boolean) {
  return disableInteraction
    ? {
        pointerEvents: 'none',
        userSelect: 'none',
      }
    : null;
}
