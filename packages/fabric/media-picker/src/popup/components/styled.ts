// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN30, akFontFamily } from '@atlaskit/util-shared-styles';

export const MediaPickerPopupWrapper = styled.div`
  * {
    box-sizing: border-box;
  }

  display: flex;
  cursor: default;
  user-select: none;
  font-family: ${akFontFamily};
  border-radius: 3px;
`;

export const SidebarWrapper = styled.div`
  width: 235px;
  min-width: 235px;
  background-color: ${akColorN30};
`;

export const ViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  /* Height of the Popup should never change */
  height: calc(100vh - 200px);

  background-color: white;
`;
