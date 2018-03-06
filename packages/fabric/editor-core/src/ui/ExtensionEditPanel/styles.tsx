// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN30 } from '@atlaskit/util-shared-styles';
import { akBorderRadius } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const Toolbar = styled.div`
  background: white;
  border-radius: ${akBorderRadius};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.22);
  padding: 5px;
  display: flex;
`;

// tslint:disable-next-line:variable-name
export const Separator = styled.span`
  border-left: 1px solid ${akColorN30};
  width: 1px;
  display: inline-block;
  margin: 0 5px;
`;
