// @flow

export default function getScrollDistance(el: HTMLElement) {
  let scrollX = 0;
  let scrollY = 0;
  let isFixed = false;

  while (el) {
    // deal with browser quirks with body/window/document and page scroll
    if (window.getComputedStyle(el, null).position === 'fixed') {
      scrollX = (el.offsetLeft - el.scrollLeft) + el.clientLeft;
      scrollY = (el.offsetTop - el.scrollTop) + el.clientTop;
      isFixed = true;
      break;
    } else if (el.tagName === 'BODY') {
      if (document.documentElement) {
        scrollX += el.scrollLeft || document.documentElement.scrollLeft;
        scrollY += el.scrollTop || document.documentElement.scrollTop;
      }
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
