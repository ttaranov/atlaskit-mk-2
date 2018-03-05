// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const TriggerWrapper = styled.div`
  display: flex;
`;

// tslint:disable-next-line:variable-name
export const Separator = styled.span`
  background: ${akColorN30};
  width: 1px;
  height: 24px;
  display: inline-block;
  margin: 0 8px;
`;

// tslint:disable-next-line:variable-name
export const Wrapper = styled.span`
  display: flex;
  align-items: center;
  div {
    display: flex;
  }
`;

// tslint:disable-next-line:variable-name
export const ExpandIconWrapper = styled.span`
  margin-left: -8px;
`;
