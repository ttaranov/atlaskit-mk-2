// @flow
import getStyle from './getStyle';

export default function getScrollDistance(el: HTMLElement) {
  let scrollX = 0;
  let scrollY = 0;
  let isFixed = false;

  while (el) {
    const position = getStyle(el, 'position');

    // handle fixed position ancestors
    if (position === 'fixed') {
      scrollX = (el.offsetLeft - el.scrollLeft) + el.clientLeft;
      scrollY = (el.offsetTop - el.scrollTop) + el.clientTop;
      isFixed = true;
      break;

    // deal with browser quirks with body/window/document and page scroll
    } else if (el.tagName === 'BODY') {
      scrollX += window.scrollX
        || window.pageXOffset
        || document.body.scrollTop + (
          (document.documentElement && document.documentElement.scrollLeft) || 0
        );
      scrollY += window.scrollY
        || window.pageYOffset
        || document.body.scrollTop + (
          (document.documentElement && document.documentElement.scrollTop) || 0
        );

    // for all other non-BODY elements
    } else {
      scrollX += el.scrollLeft;
      scrollY += el.scrollTop;
    }

    // eslint-disable-next-line no-param-reassign
    el = ((el.offsetParent: any): HTMLElement);
  }

  return { scrollX, scrollY, isFixed };
}
