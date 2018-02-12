// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
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
