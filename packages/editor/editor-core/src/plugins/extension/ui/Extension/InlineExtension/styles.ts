import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { akBorderRadius } from '@atlaskit/util-shared-styles';
import { Wrapper as WrapperDefault } from '../styles';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled(
  WrapperDefault,
)`
  cursor: pointer;
  display: inline-flex;
  margin: 1px;

  > img {
    border-radius: ${akBorderRadius};
  }

  &::after,
  &::before {
    vertical-align: text-top;
    display: inline-block;
    width: 1px;
    content: '';
  }

  &.with-children {
    padding: 0;
    background: white;
  }
`;
