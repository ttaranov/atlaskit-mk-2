/* tslint:disable:variable-name */
import styled from 'styled-components';
import { CardDimensions, CardAppearance } from '../';
import { getCSSUnitValue } from '../utils/getCSSUnitValue';
import { getCSSBoundaries } from '../utils/cardDimensions';

export interface WrapperProps {
  dimensions?: CardDimensions;
  appearance?: CardAppearance;
}

const getWrapperHeight = ({ dimensions }: WrapperProps) =>
  dimensions && dimensions.height
    ? `height: ${getCSSUnitValue(dimensions.height)}`
    : '';

const getWrapperWidth = ({ dimensions }: WrapperProps) =>
  dimensions && dimensions.width
    ? `width: ${getCSSUnitValue(dimensions.width)}`
    : '';

export const Wrapper = styled.div`
  ${({ appearance, dimensions }: WrapperProps) => {
    if (appearance === 'square' || appearance === 'horizontal') {
      return `
        ${getCSSBoundaries(appearance)}
        position: relative;
      `;
    } else if (appearance === 'small') {
      return `
        display: inline-block;
        width: 100%;
        ${getWrapperHeight}
        ${getWrapperWidth}
      `;
    }

    return `
      ${getWrapperHeight({ dimensions })}
      ${getWrapperWidth({ dimensions })}
    `;
  }};
`;
