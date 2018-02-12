// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  akColorN0,
  akColorN600,
  akColorG300,
  akColorY300,
} from '@atlaskit/util-shared-styles';
import { borderRadiusBottom } from '../../../styles';

export interface WrapperProps {
  type: 'success' | 'failure';
}

export const Wrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 7px 4px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  line-height: 18px;
  pointer-events: all;
  ${borderRadiusBottom} ${({ type }: WrapperProps) => {
      if (type === 'failure') {
        return `
        color: ${akColorN600};
        background-color: ${akColorY300}; 
      `;
      } else {
        return `
        color: ${akColorN0};
        background-color: ${akColorG300}; 
      `;
      }
    }};
`;
