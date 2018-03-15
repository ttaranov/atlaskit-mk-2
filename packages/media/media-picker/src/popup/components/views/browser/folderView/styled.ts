import styled from 'styled-components';

import { HTMLAttributes, ComponentClass, LiHTMLAttributes } from 'react';
import {
  akColorB200,
  akColorB400,
  akColorN30,
  akColorN90,
  akColorN900,
} from '@atlaskit/util-shared-styles';

export const FolderViewerWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  display: flex;
  flex-direction: column;

  height: 100%;
`;

export const SpinnerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  /* Take up all of the available space between header and footer */
  flex: 1;
`;

export const FolderViewerContent: ComponentClass<
  HTMLAttributes<{}>
> = styled.ul`
  /* Take up all of the available space between header and footer */
  flex: 1;

  /* Ensure navigation header is pinned to top */
  overflow: auto;

  list-style: none;

  /* Override default list styles */
  margin-top: 0;
  padding-left: 0;
`;

export interface SelectableProps {
  isSelected?: boolean;
}

export const FolderViewerRow: ComponentClass<
  LiHTMLAttributes<{}> & SelectableProps
> = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  height: 48px;

  margin-top: 0;
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

export const FileMetadataGroup: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  align-items: center;
`;

export const FileIcon: ComponentClass<HTMLAttributes<{}>> = styled.div`
  /* vertically center icon */
  display: flex;
  align-items: center;

  width: 32px;
  height: 32px;
`;

export const FileName: ComponentClass<
  HTMLAttributes<{}> & SelectableProps
> = styled.div`
  padding-left: 17px;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ isSelected }: SelectableProps) =>
    isSelected ? 'color: white;' : `color: ${akColorN900}`};
`;

export const FileCreateDate: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: ${akColorN90};
  text-align: right;
  padding: 0 10px 0 10px;
`;

export const FileSize: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: ${akColorN90};
  min-width: 70px;
  text-align: right;
  padding: 0 0 0 10px;
`;

export const SelectedFileIconWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  color: ${akColorB400} !important;
  right: 23px;
  top: 12px;
`;

export const MoreBtnWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  justify-content: center;

  margin-top: 10px;
`;
