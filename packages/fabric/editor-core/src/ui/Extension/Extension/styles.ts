// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN30, akBorderRadius } from '@atlaskit/util-shared-styles';
import { Wrapper as WrapperDefault, padding } from '../styles';

export const Wrapper = styled(WrapperDefault)`
  margin: 12px 0;
`;

export const Header = styled.div`
  cursor: pointer;
  padding: ${padding / 2}px ${padding / 2}px ${padding / 4}px;
  vertical-align: middle;
`;

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  padding: ${padding}px;
  background: white;
  border: 1px solid ${akColorN30};
  border-radius: ${akBorderRadius};
`;

// tslint:disable-next-line:variable-name
export const ContentWrapper = styled.div`
  padding: 0 ${padding}px ${padding}px;
`;
