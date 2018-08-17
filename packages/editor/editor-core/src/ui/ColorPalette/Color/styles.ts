import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ButtonHTMLAttributes, ComponentClass } from 'react';
import { akColorN50 } from '@atlaskit/util-shared-styles';
import ToolbarButton from '../../ToolbarButton';

export const Button: any = styled(ToolbarButton)`
  height: 26px;
  width: 26px;
  padding: 0;
  border-radius: 4px;
  background-color: ${(props: any) => props.style.backgroundColor};
  border: ${(props: any) => props.style.border};
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
