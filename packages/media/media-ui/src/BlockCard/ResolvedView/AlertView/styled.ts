import styled, { ThemedOuterStyledProps } from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import {
  akColorN0,
  akColorN600,
  akColorG300,
  akColorY300,
} from '@atlaskit/util-shared-styles';
import { borderRadiusBottom } from '../../../mixins';

export interface WrapperProps {
  type: 'success' | 'failure';
}

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & ThemedOuterStyledProps<WrapperProps, {}>
> = styled.div`
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
