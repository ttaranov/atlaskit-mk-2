import { constrainPos, constrainScale } from '../../constraint-util';

const CONTAINER_SIZE = 100;
const IMAGE_WIDTH = 200;
const IMAGE_HEIGHT = 200;
const SCALE = 1;

describe('Constraint Spec', () => {
  describe('Position Constraint', () => {
    describe('Unconstrained', () => {
      it('should return same coords when at origin position', () => {
        const constrainedPos = constrainPos(
          0,
          0,
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          SCALE,
          CONTAINER_SIZE,
        );
        expect(constrainedPos.x).toBe(0);
        expect(constrainedPos.y).toBe(0);
      });

      it('should return same coords when at middle position', () => {
        const constrainedPos = constrainPos(
          -75,
          -75,
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          SCALE,
          CONTAINER_SIZE,
        );
        expect(constrainedPos.x).toBe(-75);
        expect(constrainedPos.y).toBe(-75);
      });

      it('should return same coords when at corner position', () => {
        const constrainedPos = constrainPos(
          -100,
          -100,
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          SCALE,
          CONTAINER_SIZE,
        );
        expect(constrainedPos.x).toBe(-100);
        expect(constrainedPos.y).toBe(-100);
      });
    });

    describe('Constrained', () => {
      it('should return constrained coords when greater than origin position', () => {
        const constrainedPos = constrainPos(
          10,
          10,
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          SCALE,
          CONTAINER_SIZE,
        );
        expect(constrainedPos.x).toBe(0);
        expect(constrainedPos.y).toBe(0);
      });

      it('should return constrained coords when greater than corner position', () => {
        const constrainedPos = constrainPos(
          -105,
          -105,
          IMAGE_WIDTH,
          IMAGE_HEIGHT,
          SCALE,
          CONTAINER_SIZE,
        );
        expect(constrainedPos.x).toBe(-100);
        expect(constrainedPos.y).toBe(-100);
      });
    });
  });
});

describe('Scale Constraint', () => {
  describe('Unconstrained', () => {
    it('should return same scale when fully zoomed out', () => {
      const constrainedScale = constrainScale(
        1,
        SCALE,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        CONTAINER_SIZE,
      );
      expect(constrainedScale).toBe(1);
    });

    it('should return same scale when at min scale', () => {
      const constrainedScale = constrainScale(
        0.5,
        SCALE,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        CONTAINER_SIZE,
      );
      expect(constrainedScale).toBe(0.5);
    });
  });

  describe('Constrained', () => {
    it('should return constrained scale when zoomed lower than min scale', () => {
      const constrainedScale = constrainScale(
        0.4,
        0.5,
        IMAGE_WIDTH,
        IMAGE_HEIGHT,
        CONTAINER_SIZE,
      );
      expect(constrainedScale).toBe(0.5);
    });
  });
});
