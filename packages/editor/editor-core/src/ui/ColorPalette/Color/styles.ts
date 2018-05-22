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
  display: block;
`;

export const ButtonWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  border: 1px solid transparent;
  margin: 1px;
  font-size: 0;
  display: flex;
  align-items: center;
  padding: 1px;
  border-radius: 6px;
  &:hover {
    border: 1px solid ${akColorN50};
  }
`;
