// @flow
import Tooltip from './Tooltip';

const SHOW_DELAY = 300;
const HIDE_DELAY = 300;

export default class TooltipMarshal {
  queuedForShow: ?Tooltip
  queuedForHide: ?Tooltip
  visibleTooltip: ?Tooltip
  showTimeout: ?number
  hideTimeout: ?number
  show(tooltip: Tooltip) {
    // if the tooltip is already queued for show, don't interfere
    if (this.queuedForShow === tooltip) return;

    // if another tooltip is queued for show, clear it out
    if (this.queuedForShow) {
      this.clearShowTimeout();
    }

    // if the tooltip is already visible, make sure it's not about to be hidden
    if (this.visibleTooltip === tooltip) {
      if (this.queuedForHide === tooltip) {
        this.clearHideTimeout();
      }
      return;
    }

    // if a tooltip is already visible, but is not the one that should be
    // displayed, immediately switch them
    if (this.visibleTooltip) {
      // the visible tooltip may be queued to be hidden; prevent that
      if (this.queuedForHide) {
        this.clearHideTimeout();
      }
      // immediately hide the old tooltip and show the new one
      this.visibleTooltip.hide({ immediate: true });
      this.visibleTooltip = tooltip;
      tooltip.show({ immediate: true });
      return;
    }

    // if no tooltip is displayed, show the tooltip after a delay
    this.queuedForShow = tooltip;

    this.showTimeout = setTimeout(() => {
      this.queuedForShow = null;
      this.showTimeout = null;
      this.visibleTooltip = tooltip;
      tooltip.show({ immediate: false });
    }, SHOW_DELAY);
  }
  clearShowTimeout() {
    clearTimeout(this.showTimeout);
    this.showTimeout = null;
  }
  hide(tooltip: Tooltip) {
    // if the tooltip is already queued for hide, don't interfere
    if (this.queuedForHide === tooltip) return;

    // if the tooltip is queued for show clear it
    if (this.queuedForShow === tooltip) {
      this.clearShowTimeout();
      this.queuedForShow = null;
      return;
    }

    // bail if not the visible tooltip
    if (this.visibleTooltip !== tooltip) return;

    // queue for hide, hide current, and cleanup
    this.queuedForHide = tooltip;

    this.hideTimeout = setTimeout(() => {
      this.queuedForHide = null;
      this.hideTimeout = null;
      this.visibleTooltip = null;
      tooltip.hide({ immediate: false });
    }, HIDE_DELAY);
  }
  clearHideTimeout() {
    clearTimeout(this.hideTimeout);
    this.queuedForHide = null;
  }
}
