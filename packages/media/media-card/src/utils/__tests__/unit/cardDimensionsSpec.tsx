import {
  getCardMinHeight,
  minSmallCardDimensions,
  minImageCardDimensions,
  minHorizontalCardDimensions,
  minSquareCardDimensions,
} from '../..';

describe('cardDimensions.ts', () => {
  describe('getCardMinHeight', () => {
    it('should return small min height if no appearance passed', () => {
      expect(getCardMinHeight()).toBe(minSmallCardDimensions.height);
    });

    it('should return right height for each appearance', () => {
      expect(getCardMinHeight('auto')).toBe(minSmallCardDimensions.height);
      expect(getCardMinHeight('small')).toBe(minSmallCardDimensions.height);
      expect(getCardMinHeight('image')).toBe(minImageCardDimensions.height);
      expect(getCardMinHeight('horizontal')).toBe(
        minHorizontalCardDimensions.height,
      );
      expect(getCardMinHeight('square')).toBe(minSquareCardDimensions.height);
    });
  });
});
