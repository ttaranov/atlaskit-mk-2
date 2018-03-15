// @flow

type Position = {
  top: number,
  right: number,
  bottom: number,
  left: number,
};

export default function inViewport({ top, right, bottom, left }: Position) {
  const docEl = document.documentElement;

  return (
    top >= 0 &&
    left >= 0 &&
    bottom <= (window.innerHeight || (docEl && docEl.clientHeight) || 0) &&
    right <= (window.innerWidth || (docEl && docEl.clientWidth) || 0)
  );
}
