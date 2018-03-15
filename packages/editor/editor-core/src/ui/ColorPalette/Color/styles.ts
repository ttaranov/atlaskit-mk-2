import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import {
  akColorN900,
  akColorN50,
  akColorN0,
} from '@atlaskit/util-shared-styles';

export const Button: ComponentClass<ButtonHTMLAttributes<{}>> = styled.button`
  height: 26px;
  width: 26px;
  background: ${akColorN900};
  padding: 0;
  border-radius: 4px;
  border: 1px solid ${akColorN0};
  cursor: pointer;
`;

export const ButtonWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: inline-block;
  border: 2px solid transparent;
  margin: 1px;
  font-size: 0;
  border-radius: 6px;
  &:hover {
    border-color: ${akColorN50};
  }
`;
