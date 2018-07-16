// @flow
import type { TooltipType } from './Tooltip';
import { getStyle } from './utils';

const SCROLLABLE = /auto|scroll/;

function isScrollable(node) {
  const nodeStyle = getStyle(node);
  return (
    SCROLLABLE.test(nodeStyle.overflow) ||
    SCROLLABLE.test(nodeStyle.overflowX) ||
    SCROLLABLE.test(nodeStyle.overflowY)
  );
}
type Options = { immediate: boolean };

export default class TooltipMarshal {
  queuedForShow: ?TooltipType;
  queuedForHide: ?TooltipType;
  visibleTooltip: ?TooltipType;
  showTimeout: ?TimeoutID;
  hideTimeout: ?TimeoutID;

  scrollListenerBound: boolean = false;

  immediatelySwitch(tooltip: TooltipType) {
    return this.visibleTooltip && tooltip.state.position !== 'mouse';
  }

  /**
   * Queue a tooltip for showing.
   *
   * This should be called from Tooltip directly.
   */
  show(tooltip: TooltipType) {
    // if the tooltip is already queued for show, don't interfere
    if (this.queuedForShow === tooltip) return;

    // if another tooltip is queued for show, clear it out
    if (this.queuedForShow) {
      this.clearShowTimeout(this.queuedForShow);
    }

    // if the tooltip is already visible, make sure it's not about to be hidden
    if (this.visibleTooltip === tooltip) {
      this.clearHideTimeout(tooltip);
      return;
    }

    // if a tooltip is already visible, but is not the one that should be
    // displayed, immediately switch them
    if (this.immediatelySwitch(tooltip)) {
      // the visible tooltip may be queued to be hidden; prevent that
      this.clearHideTimeout(this.visibleTooltip);
      // immediately hide the old tooltip and show the new one
      this.showTooltip(tooltip, { immediate: true });
      return;
    }

    // if no tooltip is displayed, show the tooltip after a delay
    this.queuedForShow = tooltip;

    this.showTimeout = setTimeout(() => {
      this.showTooltip(tooltip, { immediate: false });
    }, tooltip.props.delay);
  }

  /**
   * Performs the action of showing the tooltip.
   *
   * This is an internal method and should not be called directly.
   */
  showTooltip(tooltip: TooltipType, options: Options) {
    this.queuedForShow = null;
    this.showTimeout = null;
    if (this.visibleTooltip) {
      this.hideTooltip(this.visibleTooltip, { immediate: true });
    }
    this.visibleTooltip = tooltip;
    this.addScrollListener(tooltip);
    tooltip.show(options);
  }

  clearShowTimeout(tooltip: ?TooltipType) {
    if (this.showTimeout && this.queuedForShow === tooltip) {
      clearTimeout(this.showTimeout);
      this.queuedForShow = null;
      this.showTimeout = null;
    }
  }

  addScrollListener(tooltip: TooltipType) {
    if (this.scrollListenerBound) return;

    this.scrollListenerBound = true;

    if (tooltip.wrapper) {
      let parent = tooltip.wrapper.parentNode;

      while (parent) {
        // $FlowFixMe - tagName does not exist in parent
        if (parent.tagName === 'BODY') {
          window.addEventListener('scroll', this.handleScroll);
          break;
        } else if (isScrollable(parent)) {
          if (parent.addEventListener) {
            parent.addEventListener('scroll', this.handleScroll);
          }
          break;
        }

        parent = parent.parentNode;
      }
    }
  }
  removeScrollListener(tooltip: TooltipType) {
    if (!this.scrollListenerBound) return;

    this.scrollListenerBound = false;

    if (tooltip.wrapper) {
      let parent = tooltip.wrapper.parentNode;

      while (parent) {
        // $FlowFixMe - tagName does not exist in parent
        if (parent.tagName === 'BODY') {
          window.removeEventListener('scroll', this.handleScroll);
          break;
        } else if (isScrollable(parent)) {
          parent.removeEventListener('scroll', this.handleScroll);
          break;
        }

        parent = parent.parentNode;
      }
    }
  }
  handleScroll = () => {
    if (!this.visibleTooltip) return;
    this.hideTooltip(this.visibleTooltip, { immediate: true });
  };

  /**
   * Queue a tooltip for hiding.
   *
   * This should be called from Tooltip directly.
   */
  hide(tooltip: TooltipType) {
    // if the tooltip is already queued for hide, don't interfere
    if (this.queuedForHide === tooltip) return;

    // if the tooltip is queued for show clear it
    if (this.queuedForShow === tooltip) {
      this.clearShowTimeout(tooltip);
      return;
    }

    // bail if not the visible tooltip
    if (this.visibleTooltip !== tooltip) return;

    // queue for hide, hide current, and cleanup
    this.queuedForHide = tooltip;

    this.hideTimeout = setTimeout(() => {
      this.hideTooltip(tooltip, { immediate: false });
    }, tooltip.props.delay);
  }

  /**
   * Performs the action of hiding the tooltip.
   *
   * This is an internal method and should not be called directly.
   */
  hideTooltip(tooltip: TooltipType, options: Options) {
    this.queuedForHide = null;
    this.hideTimeout = null;
    if (!this.visibleTooltip) {
      return;
    }
    this.removeScrollListener(this.visibleTooltip);
    this.visibleTooltip = null;
    tooltip.hide(options);
  }

  clearHideTimeout(tooltip: ?TooltipType) {
    if (this.hideTimeout && this.queuedForHide === tooltip) {
      clearTimeout(this.hideTimeout);
      this.queuedForHide = null;
      this.hideTimeout = null;
    }
  }

  /**
   * Called by a tooltip on unmount.
   * Remove tooltip from any show/hide queues and remove any scroll listeners
   */
  unmount(tooltip: TooltipType) {
    this.clearShowTimeout(tooltip);
    this.clearHideTimeout(tooltip);
    if (this.visibleTooltip === tooltip) {
      this.removeScrollListener(tooltip);
      this.visibleTooltip = null;
    }
  }

  // Used to cleanup unit tests
  destroy() {
    if (this.visibleTooltip) {
      this.removeScrollListener(this.visibleTooltip);
    }
  }
}
