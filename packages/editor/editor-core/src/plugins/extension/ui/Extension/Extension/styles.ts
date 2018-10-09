import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { colors, borderRadius } from '@atlaskit/theme';
import { blockNodesVerticalMargin } from '@atlaskit/editor-common';
import { Wrapper as WrapperDefault, padding } from '../styles';

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled(
  WrapperDefault,
)`
  margin: ${blockNodesVerticalMargin} 0;

  /* extension container breakout */
  &[data-layout='full-width'],
  &[data-layout='wide'] {
    margin-left: 50%;
    transform: translateX(-50%);
  }
`;

export const Header: ComponentClass<HTMLAttributes<{}>> = styled.div`
  cursor: pointer;
  padding: ${padding / 2}px ${padding / 2}px ${padding / 4}px;
  vertical-align: middle;

  &.with-children {
    padding: 0;
    background: white;
  }
`;

export const Content: ComponentClass<
  HTMLAttributes<{}> & { innerRef?: any }
> = styled.div`
  padding: ${padding}px;
  background: white;
  border: 1px solid ${colors.N30};
  border-radius: ${borderRadius()}px;
`;

export const ContentWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  padding: 0 ${padding}px ${padding}px;
`;
