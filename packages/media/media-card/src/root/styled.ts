import styled from 'styled-components';
import { akBorderRadius } from '@atlaskit/util-shared-styles';
import { HTMLAttributes, ComponentClass } from 'react';
import { MediaItemType } from '@atlaskit/media-core';
import { CardDimensions, CardAppearance } from '../';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import {
  getCSSBoundaries,
  defaultSmallCardDimensions,
  minSmallCardDimensions,
} from '../utils/cardDimensions';
import { BreakpointSizeValue, breakpointStyles } from '../utils/breakpoint';

export interface WrapperProps {
  mediaItemType: MediaItemType;
  dimensions?: CardDimensions;
  appearance?: CardAppearance;
  breakpointSize?: BreakpointSizeValue;
}

const getWrapperHeight = (dimensions?: CardDimensions) =>
  dimensions && dimensions.height
    ? `height: ${getCSSUnitValue(dimensions.height)}; max-height: 100%;`
    : '';

const getWrapperWidth = (dimensions?: CardDimensions) =>
  dimensions && dimensions.width
    ? `width: ${getCSSUnitValue(dimensions.width)}; max-width: 100%;`
    : '';

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.div`
  ${({
    appearance,
    dimensions,
    mediaItemType,
    breakpointSize = 'medium',
  }: WrapperProps) => {
    if (appearance === 'small') {
      return `
        display: inline-block;
        min-width: ${minSmallCardDimensions.width}px;
        ${getWrapperWidth(dimensions)}
        height: ${defaultSmallCardDimensions.height}px;
      `;
    }
    // Links are responsive and omit passed dimensions, instead they use max and min dimensions
    // they don't apply breakpoints either
    if (mediaItemType === 'link') {
      return `
        ${getCSSBoundaries(appearance)}
        position: relative;
      `;
    }

    return `
      ${breakpointStyles({ breakpointSize })}
      ${getWrapperHeight(dimensions)}
      ${getWrapperWidth(dimensions)}
    `;
  }};
`;

export const InlinePlayerWrapper = styled.div`
  overflow: hidden;
  border-radius: ${akBorderRadius};

  video {
    width: 100%;
    height: 100%;
  }
`;
