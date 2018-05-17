// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
import { MediaType } from '@atlaskit/media-core';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, VideoHTMLAttributes, ImgHTMLAttributes, ComponentClass, ClassAttributes } from 'react';
import {
  akColorY200,
  akColorP200,
  akColorB300,
  akColorN400,
} from '@atlaskit/util-shared-styles';

const overlayZindex = 999;

export const hideControlsClassName = 'mvng-hide-controls';

export const Blanket = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #1b2638;
  z-index: ${overlayZindex};
`;

export const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 98px;
  opacity: 0.85;
  background-image: linear-gradient(to bottom, #0e1624, rgba(14, 22, 36, 0));
  color: #b8c7e0;
  padding-top: 15px;
  padding: 24px;
  box-sizing: border-box;
  z-index: ${overlayZindex + 1};
`;

HeaderWrapper.displayName = 'HeaderWrapper';

export interface ContentWrapperProps {
  showControls: boolean;
}

export const ListWrapper = styled.div``;

ListWrapper.displayName = 'ListWrapper';

export const ArrowsWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 40%;
  left: 0;
  width: 100%;
`;

export const CloseButtonWrapper = styled.div`
  position: absolute;
  top: 24px;
  right: 20px;
  z-index: ${overlayZindex + 2};
`;

const handleControlsVisibility = ({ showControls }: ContentWrapperProps) => `
  transition: opacity .3s;
  opacity: ${showControls ? '1' : '0'};
`;

export const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;
  align-items: center;
  justify-content: center;

  .${hideControlsClassName} {
    ${handleControlsVisibility};
  }
`;

ContentWrapper.displayName = 'Content';

export const ErrorMessage = styled.div`
  color: #b8c7e0;
`;

export const Img: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  max-width: 100%;
`;

export const Video: ComponentClass<VideoHTMLAttributes<{}>> = styled.video`
  width: 100%;
  height: 100%;
`;

export const PDFWrapper = styled.div``;

const ArrowWrapper = styled.div`
  flex: 1;
  padding: 20px;
`;

export const Arrow = styled.span`
  cursor: pointer;
`;

export const LeftWrapper = styled(ArrowWrapper)`
  text-align: left;
`;

export const RightWrapper = styled(ArrowWrapper)`
  text-align: right;
`;

// header.tsx
export const Header = styled.div`
  display: flex;
`;

export const LeftHeader = styled.div`
  flex: 0.8;
`;

export const MetadataWrapper = styled.div`
  display: flex;
`;

export const MetadataFileName = styled.div`
  &::first-letter {
    text-transform: uppercase;
  }
`;

export const MetadataSubText = styled.div`
  color: ${akColorN400};
`;

export const MetadataIconWrapper = styled.div`
  padding-top: 4px;
  padding-right: 12px;
`;

const colors = {
  image: akColorY200,
  audio: akColorP200,
  video: '#ff7143',
  doc: akColorB300,
  unknown: '#3dc7dc',
};

export interface IconWrapperProps {
  type: MediaType;
}

export const IconWrapper: ComponentClass<
  HTMLAttributes<{}> & IconWrapperProps
> = styled.div`
  display: inline-flex;
  color: ${({ type }: IconWrapperProps) => colors[type] || colors.unknown};
`;

export const RightHeader = styled.div`
  flex: 0.2;
  text-align: right;
  margin-right: 50px;
`;
