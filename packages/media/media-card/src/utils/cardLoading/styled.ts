/* tslint:disable:variable-name */
import styled, { keyframes } from 'styled-components';
import { center } from '@atlaskit/media-ui';
import { akColorN20 } from '@atlaskit/util-shared-styles';
import { CardDimensions } from '../..';

export const blinkLoadingAnimation = keyframes`
  0%{
    opacity: 1;
  }

  50%{
    opacity: 0.6;
  }

  100%{
    opacity: 1;
  }
`;

export interface WrapperProps {
  dimensions: CardDimensions;
}

export const Wrapper = styled.div`
  ${center} background: ${akColorN20};
  color: #cfd4db;
  border-radius: inherit;
  max-height: 100%;
  max-width: 100%;
 
  ${(props: WrapperProps) => {
    return `
      width: ${props.dimensions.width};
      height: ${props.dimensions.height};
    `;
  }}
  > span {
    animation: ${blinkLoadingAnimation} 0.8s infinite;
  }
`;
