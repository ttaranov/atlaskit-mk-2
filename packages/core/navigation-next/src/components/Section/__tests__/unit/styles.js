// @flow
import { getSectionWrapperStyles } from '../../styles';

const commonTransitionalEnteringStyles = {
  state: 'entering',
  traversalDirection: 'up',
};

const commonTransitionalExitingStyles = {
  state: 'exiting',
  traversalDirection: 'up',
};

describe('Navigation Next: Section styles', () => {
  it('should return the base styles if is state or traversal direction is NOT valid', () => {
    expect(
      getSectionWrapperStyles({ state: 'entered', traversalDirection: 'up' }),
    ).toMatchObject({
      boxSizing: 'border-box',
    });

    expect(
      getSectionWrapperStyles({ state: 'entering', traversalDirection: null }),
    ).toMatchObject({
      boxSizing: 'border-box',
    });
  });

  describe('When state is `entering`', () => {
    it('should add different animations based on traversal direction', () => {
      const down = getSectionWrapperStyles({
        ...commonTransitionalEnteringStyles,
        traversalDirection: 'down',
      });
      const up = getSectionWrapperStyles(commonTransitionalEnteringStyles);
      expect(up.animationName !== down.animationName).toBe(true);
    });

    it('should add the specific styles for the animation', () => {
      expect(
        getSectionWrapperStyles(commonTransitionalEnteringStyles),
      ).toMatchObject({
        position: 'absolute',
        width: '100%',
      });
    });
  });

  describe('When state is `exiting`', () => {
    it('should add different animations based on traversal direction', () => {
      const down = getSectionWrapperStyles({
        ...commonTransitionalExitingStyles,
        traversalDirection: 'down',
      });
      const up = getSectionWrapperStyles(commonTransitionalExitingStyles);
      expect(up.animationName !== down.animationName).toBe(true);
    });
  });
});
