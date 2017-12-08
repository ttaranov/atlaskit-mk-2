/* tslint:disable:variable-name */
import styled from 'styled-components';
import { MediaItemType } from '@atlaskit/media-core';
import { CardDimensions, CardAppearance } from '../';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import {
  getCSSBoundaries,
  defaultSmallCardDimensions,
} from '../utils/cardDimensions';
import { BreakpointSizeValue, breakpointStyles } from '../utils/breakpoint';
import { minSmallCardDimensions } from '../utils/index';

export interface WrapperProps {
  mediaItemType: MediaItemType;
  dimensions?: CardDimensions;
  appearance?: CardAppearance;
  breakpointSize?: BreakpointSizeValue;
}

const getWrapperHeight = (dimensions?: CardDimensions) =>
  dimensions && dimensions.height
    ? `height: ${getCSSUnitValue(dimensions.height)}`
    : '';

const getWrapperWidth = (dimensions?: CardDimensions) =>
  dimensions && dimensions.width
    ? `width: ${getCSSUnitValue(dimensions.width)}`
    : '';

export const Wrapper = styled.div`
  ${({
    appearance,
    dimensions,
    mediaItemType,
    breakpointSize = 'medium',
  }: WrapperProps) => {
    if (mediaItemType === 'link') {
      return `
        ${getCSSBoundaries(appearance)}
        position: relative;
      `;
    } else if (appearance === 'small') {
      return `
        display: inline-block;
        min-width: ${defaultSmallCardDimensions.width}px;
        ${getWrapperWidth(dimensions)}
        height: ${defaultSmallCardDimensions.height}px;
      `;
    }

    return `
      ${breakpointStyles({ breakpointSize })}
      ${getWrapperHeight(dimensions)}
      ${getWrapperWidth(dimensions)}
    `;
  }};
`;
