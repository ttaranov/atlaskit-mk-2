import styled from 'styled-components';
import {
  akColorB200,
  akColorB400,
  akColorN30,
  akColorN90,
  akColorN900,
} from '@atlaskit/util-shared-styles';

export const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const FolderViewerWrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const FolderViewerContent = styled.ul`
  margin: 60px 0 0 0;
  padding: 0;
  position: relative;
  z-index: 10;
  overflow-y: auto;
`;

export interface SelectableProps {
  isSelected: boolean;
}

export const FolderViewerRow = styled.li`
  list-style-type: none;
  position: relative;
  box-sizing: border-box;

  float: left;
  width: 100%;
  font-size: 14px;
  height: 48px;
  padding: 8px 28px 8px 28px;
  cursor: pointer;

  ${({ isSelected }: SelectableProps) =>
    isSelected
      ? `background-color: ${akColorB200};`
      : 'background-color: white;'} &:hover {
    ${({ isSelected }: SelectableProps) =>
      isSelected
        ? `background-color: ${akColorB200};`
        : `background-color: ${akColorN30};`};
  }
`;

export const SelectedFileIconWrapper = styled.div`
  color: ${akColorB400} !important;
  position: absolute;
  right: 23px;
  top: 12px;
`;

const FolderViewerColumn = styled.div`
  display: table-cell;
  vertical-align: middle;
  white-space: nowrap;
`;

export const IconFolderViewerColumn = styled(FolderViewerColumn)`
  width: 32px;
  height: 32px;
  min-width: 32px;
  max-width: 32px;
  text-align: center;
  vertical-align: middle;

  svg,
  img {
    vertical-align: middle;
  }
`;

export const NameFolderViewerColumn = styled(FolderViewerColumn)`
  width: 100%;
  box-sizing: border-box;
  padding-left: 17px;
  overflow: hidden;
  vertical-align: middle;

  max-width: 0;
  text-overflow: ellipsis;

  ${({ isSelected }: SelectableProps) =>
    isSelected ? 'color: white;' : `color: ${akColorN900}`};
`;

export const DateFolderViewerColumn = styled(FolderViewerColumn)`
  color: ${akColorN90};
  text-align: right;
  padding: 0 10px 0 10px;
  ${({ isSelected }: SelectableProps) => (isSelected ? 'display: none;' : '')};
`;

export const SizeFolderViewerColumn = styled(FolderViewerColumn)`
  color: ${akColorN90};
  min-width: 70px;
  text-align: right;
  padding: 0 0 0 10px;
  ${({ isSelected }: SelectableProps) => (isSelected ? 'display: none;' : '')};
`;

export const MoreBtnWrapper = styled.div`
  float: left;
  width: 100%;
  text-align: center;
`;
