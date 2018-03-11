/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass, keyframes } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { center, size } from '../../styles';
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

export const Wrapper = styled.div`
  ${center} ${size()} background: ${akColorN20};
  color: #cfd4db;
  border-radius: inherit;

  > span {
    animation: ${blinkLoadingAnimation} 0.8s infinite;
  }
`;
