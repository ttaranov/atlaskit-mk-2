import styled, { keyframes } from 'styled-components';
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
  padding-top: 7px;
  padding-bottom: 7px;
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
