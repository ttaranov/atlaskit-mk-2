// @flow

// eslint-disable-next-line import/prefer-default-export
export function getLayerPosition(position: string) {
  const allowed = {
    bottom: 'bottom center',
    left: 'left middle',
    right: 'right middle',
    top: 'top center',
  };

  return allowed[position] || allowed.bottom;
}
