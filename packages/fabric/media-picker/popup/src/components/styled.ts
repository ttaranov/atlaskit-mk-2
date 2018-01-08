import styled from 'styled-components';
import { akColorN30, akFontFamily } from '@atlaskit/util-shared-styles';
export const MediaPickerPopupWrapper = styled.div`
  * {
    box-sizing: border-box;
  }
  font-family: ${akFontFamily};
  user-select: none;
  cursor: default;
  border-radius: 3px;
  display: flex;
  overflow: hidden;
`;

export const SidebarWrapper = styled.div`
  width: 235px;
  min-width: 235px;
  background-color: ${akColorN30};
  position: relative;
  z-index: 60;
`;

export const ViewWrapper = styled.div`
  background-color: white;
  position: relative;
  overflow: auto;
  flex: 1;
`;

export const ContentWrapper = styled.div`
  height: calc(100vh - 200px);
`;
