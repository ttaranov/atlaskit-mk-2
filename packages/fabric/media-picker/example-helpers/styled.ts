/* tslint:disable:variable-name */
import styled from 'styled-components';

export interface DropzoneContainerProps {
  isActive: boolean;
}

export const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 100px);
  overflow: hidden;
`;

export const PopupHeader = styled.div`
  border-bottom: 1px solid #ccc;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  padding: 30px 0;

  > * {
    margin-right: 15px;
  }
`;

export const PopupEventsWrapper = styled.div`
  overflow: auto;
`;

export const PreviewImage = styled.img`
  width: 300px;
`;

export const DropzoneContainer = styled.div`
  width: 600px;
  min-height: 500px;
  border: 1px dashed transparent;

  ${(props: DropzoneContainerProps) =>
    props.isActive
      ? `
    border-color: gray;
  `
      : ''};
`;

export const DropzoneConfigOptions = styled.div``;

export const DropzoneRoot = styled.div`
  display: flex;
`;

export const DropzoneContentWrapper = styled.div`
  display: flex;
`;

export const DropzonePreviewsWrapper = styled.div`
  overflow: auto;
  width: 300px;
`;

export const DropzoneItemsInfo = styled.div`
  flex: 1;
  min-width: 600px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export interface ClipboardContainerProps {
  isWindowFocused: boolean;
}

export const ClipboardContainer = styled.div`
  padding: 10px;
  min-height: 400px;

  border: ${({ isWindowFocused }: ClipboardContainerProps) =>
    isWindowFocused ? `1px dashed gray` : `1px dashed transparent`};
`;
