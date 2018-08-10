// @ts-ignore
import { ClassAttributes, HTMLAttributes, ImgHTMLAttributes } from 'react';
// @ts-ignore
import styled, { StyledComponentClass } from 'styled-components';
import { colors } from '@atlaskit/theme';
export const imageMargin = 10;
const borderWidth = 5;
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
  outlinesEnabled: boolean;
}

export const Img = styled.img`
  width: 100%;
  ${({ outlinesEnabled, isSelected }: ImgProps) =>
    outlinesEnabled
      ? ` 
    outline-style: solid;
    outline-width: ${borderWidth}px;
    outline-offset: -${borderWidth}px;
    outline-color: ${isSelected ? `${colors.B500} !important` : 'transparent'};
    // transition: outline 0.5s cubic-bezier(0.165, 0.84, 0.44, 1); //cubic-bezier(0.19, 1, 0.22, 1);

    &:hover {
      outline-color: ${colors.B300};
    }
    `
      : ``};
`;

export interface ImgWrapperProps {
  hasPlaceholder: boolean;
  isRightPlaceholder: boolean;
  isLoaded?: boolean;
}

const paddingProperties = (hasPlaceholder, isRightPlaceholder) => {
  if (!hasPlaceholder) {
    return `
    padding-left: 0;
    border-left: 0;
    `;
  }

  if (isRightPlaceholder) {
    return `
    padding-right: 14px;
    border-right: 4px solid ${colors.B100};
    `;
  } else {
    return `
    padding-left: 14px;
    border-left: 4px solid ${colors.B100};
    `;
  }
};

export const ImgWrapper = styled.div`
  transition: margin-left 0.2s, padding-left 0.2s, margin-right 0.2s,
    padding-right 0.2s;
  ${(props: ImgWrapperProps) =>
    paddingProperties(props.hasPlaceholder, props.isRightPlaceholder)};
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
    !props.isLoaded ? `background-color: ${colors.N30};` : ''};
`;

export const Wrapper = styled.div``;
export const ImagePlaceholder = styled.div`
  background-color: ${colors.N30};
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
