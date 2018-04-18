// @flow

import getPosition from '../getPosition';

type boundingRectArgs = {
  width: number,
  height: number,
  top?: number,
  left?: number,
};

const createElWithBoundingRect = ({
  width,
  height,
  top = 0,
  left = 0,
}: boundingRectArgs) => {
  const el = document.createElement('div');
  Object.assign(el.style, {
    width: `${width}px`,
    height: `${height}px`,
    top: `${top}px`,
    left: `${left}px`,
  });

  // $FlowFixMe - not allowing assignment of read-only property
  el.getBoundingClientRect = () => ({
    width: parseInt(el.style.width, 10),
    height: parseInt(el.style.height, 10),
    top: parseInt(el.style.top, 10),
    left: parseInt(el.style.left, 10),
    right: parseInt(el.style.left, 10) + parseInt(el.style.width, 10),
    bottom: parseInt(el.style.top, 10) + parseInt(height, 10),
  });

  return el;
};

describe('getPosition', () => {
  let target;
  let tooltip;
  let multilineTooltip;
  const viewportHeight = 768;
  const viewportWidth = 1024;
  const targetWidth = 150;
  const targetHeight = 100;
  beforeEach(() => {
    if (document.documentElement) {
      // Keep viewport bounds consistent
      document.documentElement.clientHeight = viewportHeight;
      document.documentElement.clientWidth = viewportWidth;
    }

    target = createElWithBoundingRect({
      width: targetWidth,
      height: targetHeight,
    });

    tooltip = createElWithBoundingRect({ width: 70, height: 20 });

    // This has the default max width of tooltips and a height greater than the target height
    // to demonstrate the shifting behaviour that occurs in these scenarios
    multilineTooltip = createElWithBoundingRect({
      width: 240,
      height: targetHeight + 50,
    });
  });

  describe('target not near viewport bounds', () => {
    beforeEach(() => {
      target.style.top = '300px';
      target.style.left = '400px';
    });

    it('should centre tooltip below target for bottom position', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 440,
            top: 408,
          },
          position: 'bottom',
        }),
      );
    });

    it('should centre tooltip to left of target for left position', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 322,
            top: 340,
          },
          position: 'left',
        }),
      );
    });

    it('should centre tooltip above target for top position', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 440,
            top: 272,
          },
          position: 'top',
        }),
      );
    });

    it('should centre tooltip to right of target for right position', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 558,
            top: 340,
          },
          position: 'right',
        }),
      );
    });
  });

  describe('target near top left viewport boundary', () => {
    beforeEach(() => {
      target.style.top = '20px';
      target.style.left = '20px';
    });

    it('should centre tooltip below target for bottom position when tooltip can display without overflowing viewport', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 60,
            top: 128,
          },
          position: 'bottom',
        }),
      );
    });

    it('should shift tooltip to the right for bottom position when tooltip overflows the left viewport', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 8,
            top: 128,
          },
          position: 'bottom',
        }),
      );
    });

    it('should autoflip tooltip to the right for left position when tooltip overflows the left viewport', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 178,
            top: 60,
          },
          position: 'right',
        }),
      );
    });

    it('should autoflip tooltip to the right and shift tooltip down for left position when tooltip overflows the left and top viewport boundary', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 178,
            top: 8,
          },
          position: 'right',
        }),
      );
    });

    it('should autoflip tooltip to the bottom for top position when tooltip overflows the top viewport', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 60,
            top: 128,
          },
          position: 'bottom',
        }),
      );
    });

    it('should autoflip tooltip to the bottom and shift tooltip to the right for top position when tooltip overflows the top and left viewport boundaries', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 8,
            top: 128,
          },
          position: 'bottom',
        }),
      );
    });

    it('should centre tooltip to right of target for right position', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 178,
            top: 60,
          },
          position: 'right',
        }),
      );
    });

    it('should shift tooltip down for right position when tooltip overflows above viewport', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 178,
            top: 8,
          },
          position: 'right',
        }),
      );
    });
  });

  describe('target near top right viewport boundary', () => {
    beforeEach(() => {
      target.style.top = '20px';
      target.style.left = `${viewportWidth - targetWidth - 20}px`;
    });

    it('should centre tooltip below target for bottom position when tooltip can display without overflowing viewport', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 894,
            top: 128,
          },
          position: 'bottom',
        }),
      );
    });

    it('should shift tooltip to the left for bottom position when tooltip overflows the right viewport', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 776,
            top: 128,
          },
          position: 'bottom',
        }),
      );
    });

    it('should centre tooltip to left of target for left position', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 776,
            top: 60,
          },
          position: 'left',
        }),
      );
    });

    it('should shift tooltip down for left position when tooltip overflows top viewport', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 606,
            top: 8,
          },
          position: 'left',
        }),
      );
    });

    it('should autoflip tooltip to the bottom for top position when tooltip overflows the top viewport', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 894,
            top: 128,
          },
          position: 'bottom',
        }),
      );
    });

    it('should autoflip tooltip to the bottom and shift tooltip to the left for top position when tooltip overflows the top and right viewport boundaries', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 776,
            top: 128,
          },
          position: 'bottom',
        }),
      );
    });

    it('should autoflip tooltip to the left for right position when tooltip overflows the right viewport', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 776,
            top: 60,
          },
          position: 'left',
        }),
      );
    });

    it('should autoflip tooltip to the left and shift tooltip down for right position when tooltip overflows the top and right viewport boundaries', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 606,
            top: 8,
          },
          position: 'left',
        }),
      );
    });
  });

  describe('target near bottom right viewport boundary', () => {
    beforeEach(() => {
      target.style.top = `${viewportHeight - targetHeight - 20}px`;
      target.style.left = `${viewportWidth - targetWidth - 20}px`;
    });

    it('should autoflip tooltip to the top for bottom position when tooltip overflows the bottom viewport', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 894,
            top: 620,
          },
          position: 'top',
        }),
      );
    });

    it('should autoflip tooltip to the top and shift tooltip to left for bottom position when tooltip overflows the bottom and right viewport boundaries', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 776,
            top: 490,
          },
          position: 'top',
        }),
      );
    });

    it('should centre tooltip to left of target for left position', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 776,
            top: 688,
          },
          position: 'left',
        }),
      );
    });

    it('should shift tooltip up for left position when it overflows bottom viewport', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 606,
            top: 610,
          },
          position: 'left',
        }),
      );
    });

    it('should centre tooltip above target for top position', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 894,
            top: 620,
          },
          position: 'top',
        }),
      );
    });

    it('should shift tooltip to the left for top position when tooltip overflows the right viewport', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 776,
            top: 490,
          },
          position: 'top',
        }),
      );
    });

    it('should autoflip tooltip to the left for right position when tooltip overflows the right viewport', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 776,
            top: 688,
          },
          position: 'left',
        }),
      );
    });

    it('should autoflip tooltip to the left and shift tooltip up for right position when tooltip overflows the right and bottom viewport boundaries', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 606,
            top: 610,
          },
          position: 'left',
        }),
      );
    });
  });

  describe('target near bottom left viewport boundary', () => {
    beforeEach(() => {
      target.style.top = `${viewportHeight - targetHeight - 20}px`;
      target.style.left = '20px';
    });

    it('should autoflip tooltip to the top for bottom position when tooltip overflows the bottom viewport', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 60,
            top: 620,
          },
          position: 'top',
        }),
      );
    });

    it('should autoflip tooltip to the top and shift tooltip to right for bottom position when tooltip overflows the bottom and left viewport boundaries', () => {
      const positionData = getPosition({
        position: 'bottom',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 8,
            top: 490,
          },
          position: 'top',
        }),
      );
    });

    it('should autoflip tooltip to the right for left position when tooltip overflows the left viewport', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 178,
            top: 688,
          },
          position: 'right',
        }),
      );
    });

    it('should autoflip tooltip to the right and shift tooltip up for left position when tooltip overflows the left and bottom viewport boundaries', () => {
      const positionData = getPosition({
        position: 'left',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 178,
            top: 610,
          },
          position: 'right',
        }),
      );
    });

    it('should centre tooltip above target for top position', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'top',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 60,
            top: 620,
          },
          position: 'top',
        }),
      );
    });

    it('should shift tooltip to the right for top position when tooltip overflows the left viewport', () => {
      const positionData = getPosition({
        position: 'top',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 8,
            top: 490,
          },
          position: 'top',
        }),
      );
    });

    it('should centre tooltip to right of target for right position', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 178,
            top: 688,
          },
          position: 'right',
        }),
      );
    });

    it('should shift tooltip up for right position when it overflows bottom viewport', () => {
      const positionData = getPosition({
        position: 'right',
        target,
        tooltip: multilineTooltip,
        mouseCoordinates: { left: 0, top: 0 },
        mousePosition: 'bottom',
      });

      expect(positionData).toEqual(
        expect.objectContaining({
          coordinates: {
            left: 178,
            top: 610,
          },
          position: 'right',
        }),
      );
    });
  });
});
