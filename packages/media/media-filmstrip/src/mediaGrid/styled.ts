// @ts-ignore
import { ClassAttributes, HTMLAttributes, ImgHTMLAttributes } from 'react';
// @ts-ignore
import styled, { StyledComponentClass } from 'styled-components';
import { colors } from '@atlaskit/theme';
export const imageMargin = 10;

export const RowWrapper = styled.div`
  position: relative;
  line-height: 0;
  margin-bottom: ${imageMargin}px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export interface ImgProps {
  isSelected: boolean;
}

export const Img = styled.img`
  width: 100%;
  outline-style: solid;
  outline-width: 5px;
  outline-color: ${({ isSelected }: ImgProps) =>
    isSelected ? `${colors.B500} !important` : 'transparent'};
  transition: outline 0.6s cubic-bezier(0.19, 1, 0.22, 1);

  &:hover {
    outline-color: ${colors.B300};
  }
`;

export interface ImgWrapperProps {
  hasPlaceholder: boolean;
  isRightPlaceholder: boolean;
  isLoaded?: boolean;
}
export const ImgWrapper = styled.div`
  transition: margin-left 0.2s, padding-left 0.2s, margin-right 0.2s,
    padding-right 0.2s;
  ${(props: ImgWrapperProps) =>
    props.hasPlaceholder
      ? props.isRightPlaceholder
        ? `
    padding-right: 14px;
    border-right: 4px solid #4c9aff;
  `
        : `
    padding-left: 14px;
    border-left: 4px solid #4c9aff;
  `
      : `
    padding-left: 0;
    border-left: 0;
  `};
  display: inline-block;
  margin-right: ${imageMargin}px;
  position: relative;

  &:hover {
    .remove-img-wrapper {
      opacity: 1;
    }
  }

  &:last-child {
    margin-right: 0;
  }

  ${(props: ImgWrapperProps) =>
    !props.isLoaded ? 'background-color: #ecf0f8;' : ''};
`;

export const Wrapper = styled.div``;
export const ImagePlaceholder = styled.div`
  background-color: #ecf0f8;
  width: 100%;
  height: 100%;
`;

export const RemoveIconWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s;

  button {
    color: white !important;
  }
`;
