import { getCSSUnitValue } from './getCSSUnitValue';
import { CardAppearance, CardDimensions } from '..';

// Default dimensions

export const defaultSmallCardDimensions = {
  width: '100%',
  height: 42,
};

export const defaultImageCardDimensions = {
  width: 156,
  height: 125,
};

export const defaultHorizontalCardDimensions: CardDimensions = {
  width: 435,
  height: 125,
};

export const defaultSquareCardDimensions = {
  width: 300,
  height: 300,
};

// Small dimensions

export const minSmallCardDimensions = {
  width: 200,
  height: 32,
};

export const minImageCardDimensions = {
  width: 144,
  height: 96,
};

export const minSquareCardDimensions = {
  width: 272,
  height: 275,
};

export const minHorizontalCardDimensions = {
  width: 400,
  height: 125,
};

// Max dimensions

export const maxImageCardDimensions = {
  width: 480,
  height: 360,
};

export const maxHorizontalCardDimensions = {
  width: 400,
  height: 116,
};

export const maxSquareCardDimensions = {
  width: 400,
  height: 348,
};

export const getCardMinHeight = (appearance?: CardAppearance) => {
  if (appearance === 'small') {
    return minSmallCardDimensions.height;
  }

  if (appearance === 'image') {
    return minImageCardDimensions.height;
  }

  if (appearance === 'horizontal') {
    return minHorizontalCardDimensions.height;
  }

  if (appearance === 'square') {
    return minSquareCardDimensions.height;
  }

  return minSmallCardDimensions.height;
};

export const getCardMaxHeight = (appearance?: CardAppearance) => {
  if (appearance === 'image') {
    return maxImageCardDimensions.height;
  }

  if (appearance === 'horizontal') {
    return maxHorizontalCardDimensions.height;
  }

  if (appearance === 'square') {
    return maxSquareCardDimensions.height;
  }

  return maxSquareCardDimensions.width;
};

export const getCardMinWidth = (appearance?: CardAppearance) => {
  if (appearance === 'small') {
    return minSmallCardDimensions.width;
  }

  if (appearance === 'image') {
    return minImageCardDimensions.width;
  }

  if (appearance === 'horizontal') {
    return minHorizontalCardDimensions.width;
  }

  if (appearance === 'square') {
    return minSquareCardDimensions.width;
  }

  return minSmallCardDimensions.width;
};

export const getCardMaxWidth = (appearance?: CardAppearance) => {
  if (appearance === 'image') {
    return maxImageCardDimensions.width;
  }

  if (appearance === 'horizontal') {
    return maxHorizontalCardDimensions.width;
  }

  if (appearance === 'square') {
    return maxSquareCardDimensions.width;
  }

  return maxSquareCardDimensions.width;
};

export const getCSSBoundaries = (appearance?: CardAppearance) => {
  const width = `
    min-width: ${getCSSUnitValue(getCardMinWidth(appearance))};
    max-width: ${getCSSUnitValue(getCardMaxWidth(appearance))};
  `;
  let height = '';

  if (appearance === 'horizontal') {
    height = `
      height: ${getCSSUnitValue(defaultHorizontalCardDimensions.height || '')};
    `;
  }

  return width + height;
};

export const getDefaultCardDimensions = (
  appearance?: CardAppearance,
): CardDimensions => {
  if (appearance === 'small') {
    return defaultSmallCardDimensions;
  }

  if (appearance === 'image') {
    return defaultImageCardDimensions;
  }

  if (appearance === 'square') {
    return defaultSquareCardDimensions;
  }

  if (appearance === 'horizontal') {
    return defaultHorizontalCardDimensions;
  }

  return defaultImageCardDimensions;
};
