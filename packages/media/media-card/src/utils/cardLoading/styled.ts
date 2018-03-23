/* tslint:disable:variable-name */
import styled, { keyframes } from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { center, size } from '@atlaskit/media-ui';
import { akColorN20 } from '@atlaskit/util-shared-styles';

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

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${center} ${size()} background: ${akColorN20};
  color: #cfd4db;
  border-radius: inherit;

  > span {
    animation: ${blinkLoadingAnimation} 0.8s infinite;
  }
`;
