// tslint:disable:variable-name
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN0 } from '@atlaskit/util-shared-styles';

export const PopupBase = styled.div`
  position: absolute;
  pointer-events: auto;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  bottom: 48px;
  padding: 4px;
  background-color: ${akColorN0};
`;

export const LineWidthPopupContainer = styled(PopupBase)`
  right: 270px;
  width: 160px;
  padding: 9px;
`;

export const ColorPopupContainer = styled(PopupBase)`
  width: 192px;
  right: 226px;
  padding: 8px;
`;
