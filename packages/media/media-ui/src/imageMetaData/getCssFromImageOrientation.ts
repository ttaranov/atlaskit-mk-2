const ORIENT_TRANSFORMS: { [key: number]: string } = {
  1: 'none',
  2: 'rotateY(180deg)',
  3: 'rotate(180deg)',
  4: 'rotate(180deg) rotateY(180deg)',
  5: 'rotate(270deg) rotateY(180deg)',
  6: 'rotate(90deg)',
  7: 'rotate(90deg) rotateY(180deg)',
  8: 'rotate(270deg)',
};

export const getCssFromImageOrientation = (orientation: number): string => {
  return ORIENT_TRANSFORMS[orientation];
};
