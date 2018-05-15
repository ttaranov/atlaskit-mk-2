// @flow

import Marshal from '../Marshal';
import Tooltip from '../Tooltip';

jest.useFakeTimers();

describe('Marshal', () => {
  let marshal;
  let tooltip: Tooltip;
  let anotherTooltip: Tooltip;
  const scrollableParent = document.createElement('div');
  scrollableParent.style.overflow = 'auto';
  if (document.body) {
    document.body.appendChild(scrollableParent);
  }

  beforeEach(() => {
    jest.clearAllMocks();
    marshal = new Marshal();
    tooltip = {
      show: jest.fn(),
      hide: jest.fn(),
      props: { delay: 300 },
      state: {
        position: 'bottom',
      },
      wrapper: {
        parentNode: document.body,
      },
    };
    anotherTooltip = {
      show: jest.fn(),
      hide: jest.fn(),
      props: { delay: 300 },
      state: {
        position: 'bottom',
      },
      wrapper: {
        parentNode: scrollableParent,
      },
    };
  });

  afterEach(() => {
    marshal.destroy();
  });

  describe('show method', () => {
    it('should queue the tooltip to display after a certain delay by default', () => {
      marshal.show(tooltip);
      expect(tooltip.show).not.toHaveBeenCalled();

      jest.runTimersToTime(299);
      expect(tooltip.show).not.toHaveBeenCalled();

      jest.runTimersToTime(1);
      expect(tooltip.show).toHaveBeenCalledWith({ immediate: false });
    });

    it("should delay the showing/hiding of a tooltip based on the tooltip's delay prop", () => {
      // Non-default delay value
      const customDelay: Tooltip = {
        show: jest.fn(),
        hide: jest.fn(),
        props: { delay: 100 },
        state: { position: 'bottom' },
        wrapper: { parentNode: document.body },
      };

      marshal.show(customDelay);
      expect(customDelay.show).not.toHaveBeenCalled();

      jest.runTimersToTime(99);
      expect(customDelay.show).not.toHaveBeenCalled();

      jest.runTimersToTime(1);
      expect(customDelay.show).toHaveBeenCalledWith({ immediate: false });

      marshal.hide(customDelay);

      expect(customDelay.hide).not.toHaveBeenCalled();

      jest.runTimersToTime(99);
      expect(customDelay.hide).not.toHaveBeenCalled();

      jest.runTimersToTime(1);
      expect(customDelay.hide).toHaveBeenCalledWith({ immediate: false });

      // Zero delay value
      const zeroDelay: Tooltip = {
        show: jest.fn(),
        hide: jest.fn(),
        props: { delay: 0 },
        state: { position: 'bottom' },
        wrapper: { parentNode: document.body },
      };

      marshal.show(zeroDelay);
      expect(zeroDelay.show).not.toHaveBeenCalled();

      jest.runTimersToTime(1);
      expect(zeroDelay.show).toHaveBeenCalledWith({ immediate: false });

      marshal.hide(zeroDelay);
      expect(zeroDelay.hide).not.toHaveBeenCalled();

      jest.runTimersToTime(1);
      expect(zeroDelay.hide).toHaveBeenCalledWith({ immediate: false });
    });

    it('should immediately show the tooltip if another tooltip is visible', () => {
      marshal.show(tooltip);
      jest.runAllTimers();

      expect(tooltip.show).toHaveBeenCalled();
      expect(tooltip.hide).not.toHaveBeenCalled();

      marshal.show(anotherTooltip);

      expect(tooltip.hide).toHaveBeenCalledWith({ immediate: true });
      expect(anotherTooltip.show).toHaveBeenCalledWith({ immediate: true });
    });

    it("should never immediately show the tooltip if it's position is mouse", () => {
      anotherTooltip.state.position = 'mouse';

      marshal.show(tooltip);
      jest.runAllTimers();

      expect(tooltip.show).toHaveBeenCalled();

      marshal.show(anotherTooltip);
      expect(tooltip.hide).not.toHaveBeenCalled();
      expect(anotherTooltip.show).not.toHaveBeenCalled();

      jest.runAllTimers();
      expect(tooltip.hide).toHaveBeenCalledWith({ immediate: true });
      expect(anotherTooltip.show).toHaveBeenCalledWith({ immediate: false });
    });

    it('should still immediately show tooltip if visible one has position mouse but next one does not', () => {
      tooltip.state.position = 'mouse';

      marshal.show(tooltip);
      jest.runAllTimers();

      expect(tooltip.show).toHaveBeenCalled();

      marshal.show(anotherTooltip);

      expect(tooltip.hide).toHaveBeenCalledWith({ immediate: true });
      expect(anotherTooltip.show).toHaveBeenCalledWith({ immediate: true });
    });

    it('should display only the last tooltip passed to show before one is displayed', () => {
      marshal.show(tooltip);
      expect(tooltip.show).not.toHaveBeenCalled();

      marshal.show(anotherTooltip);
      expect(anotherTooltip.show).not.toHaveBeenCalled();

      jest.runAllTimers();
      expect(tooltip.show).not.toHaveBeenCalled();
      expect(anotherTooltip.show).toHaveBeenCalled();
    });

    it('should cancel any hide timeouts for the visible tooltip if it was queued to hide', () => {
      marshal.show(tooltip);
      jest.runAllTimers();

      expect(tooltip.show).toHaveBeenCalledTimes(1);

      marshal.hide(tooltip);
      expect(tooltip.hide).not.toHaveBeenCalled();

      marshal.show(tooltip);
      jest.runAllTimers();

      expect(tooltip.hide).not.toHaveBeenCalled();
      expect(tooltip.show).toHaveBeenCalledTimes(1);
    });
  });

  describe('hide method', () => {
    it('should hide the tooltip after a delay by default', () => {
      marshal.show(tooltip);
      jest.runAllTimers();
      expect(tooltip.show).toHaveBeenCalled();

      marshal.hide(tooltip);
      jest.runTimersToTime(299);
      expect(tooltip.hide).not.toHaveBeenCalled();

      jest.runTimersToTime(1);
      expect(tooltip.hide).toHaveBeenCalledWith({ immediate: false });
    });

    it('should cancel any scheduled show calls', () => {
      marshal.show(tooltip);
      expect(tooltip.show).not.toHaveBeenCalled();

      marshal.hide(tooltip);
      expect(tooltip.hide).not.toHaveBeenCalled();

      jest.runAllTimers();
      expect(tooltip.show).not.toHaveBeenCalled();
      expect(tooltip.hide).not.toHaveBeenCalled();
    });

    it('should only hide tooltip once if tooltip becomes hidden from another tooltip displaying immediately', () => {
      marshal.show(tooltip);
      jest.runAllTimers();

      marshal.hide(tooltip);
      marshal.show(anotherTooltip);

      expect(tooltip.hide).toHaveBeenCalledTimes(1);
      jest.runAllTimers();
      expect(tooltip.hide).toHaveBeenCalledTimes(1);
    });
  });

  describe('unmount method', () => {
    it('should remove the tooltip from the show queue', () => {
      marshal.show(tooltip);
      marshal.unmount(tooltip);

      jest.runAllTimers();

      expect(tooltip.show).not.toHaveBeenCalled();
    });

    it('should remove the tooltip from the hide queue', () => {
      marshal.show(tooltip);
      jest.runAllTimers();

      marshal.hide(tooltip);
      marshal.unmount(tooltip);

      jest.runAllTimers();

      expect(tooltip.hide).not.toHaveBeenCalled();
    });

    it('should unmark tooltip as being visible', () => {
      marshal.show(tooltip);
      jest.runAllTimers();

      marshal.unmount(tooltip);

      jest.runAllTimers();

      expect(tooltip.hide).not.toHaveBeenCalled();

      marshal.show(anotherTooltip);
      jest.runAllTimers();

      // Hide would be called after showing another tooltip if this tooltip
      // was still marked as visible
      expect(tooltip.hide).not.toHaveBeenCalled();
    });

    it('should not unmark another tooltip as visible', () => {
      marshal.show(tooltip);
      jest.runAllTimers();

      marshal.unmount(anotherTooltip);
      marshal.hide(tooltip);
      jest.runAllTimers();

      expect(tooltip.hide).toHaveBeenCalled();
    });

    it('should remove the scroll listeners attached to the tooltip if it was visible when unmounted', () => {
      jest.spyOn(window, 'addEventListener');
      jest.spyOn(window, 'removeEventListener');

      marshal.show(tooltip);
      jest.runAllTimers();
      expect(window.addEventListener).toHaveBeenCalledTimes(1);

      marshal.unmount(tooltip);
      jest.runAllTimers();

      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    });

    it('should not remove scroll listeners attached to another tooltip if the unmounted tooltip was not visible', () => {
      jest.spyOn(window, 'addEventListener');
      jest.spyOn(window, 'removeEventListener');

      marshal.show(tooltip);
      jest.runAllTimers();
      expect(window.addEventListener).toHaveBeenCalledTimes(1);

      marshal.unmount(anotherTooltip);
      jest.runAllTimers();

      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalledTimes(0);
    });
  });

  describe('scroll', () => {
    it('should hide tooltips immediately on scroll', () => {
      marshal.show(tooltip);
      jest.runAllTimers();
      expect(tooltip.hide).not.toHaveBeenCalled();

      window.dispatchEvent(new Event('scroll'));

      expect(tooltip.hide).toHaveBeenCalled();
    });

    it('should remove any scroll listeners when hiding tooltip', () => {
      jest.spyOn(window, 'addEventListener');
      jest.spyOn(window, 'removeEventListener');

      marshal.show(tooltip);
      jest.runAllTimers();
      expect(window.addEventListener).toHaveBeenCalledTimes(1);

      marshal.hide(tooltip);
      jest.runAllTimers();

      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    });

    it('should remove scroll listeners on the old tooltip when another tooltip is shown', () => {
      jest.spyOn(window, 'addEventListener');
      jest.spyOn(window, 'removeEventListener');
      jest.spyOn(scrollableParent, 'addEventListener');

      marshal.show(tooltip);
      jest.runAllTimers();
      expect(window.addEventListener).toHaveBeenCalledTimes(1);

      marshal.hide(tooltip);
      marshal.show(anotherTooltip);
      jest.runAllTimers();

      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalledTimes(1);
      expect(scrollableParent.addEventListener).toHaveBeenCalledTimes(1);
    });

    it('should remove scroll listener of visible tooltip when destroy method is called', () => {
      jest.spyOn(window, 'addEventListener');
      jest.spyOn(window, 'removeEventListener');

      marshal.show(tooltip);
      jest.runAllTimers();

      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalledTimes(0);

      marshal.destroy();

      expect(window.addEventListener).toHaveBeenCalledTimes(1);
      expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    });

    xit('should close on window scroll even if within a scroll parent??', () => {});
  });
});
