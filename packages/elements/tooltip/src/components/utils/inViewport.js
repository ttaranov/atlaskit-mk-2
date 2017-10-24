// @flow

type Position = {
  top: number,
  right: number,
  bottom: number,
  left: number
};

export default function inViewport({ top, right, bottom, left }: Position) {
  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
