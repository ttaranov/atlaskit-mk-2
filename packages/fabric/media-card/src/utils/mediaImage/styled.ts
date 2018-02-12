/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import { HTMLAttributes, ClassAttributes } from 'react';
import { size, fadeIn } from '../../styles';

export interface ImageViewWrapperProps {
  fadeIn?: boolean;
  isCropped?: boolean;
}

export const transparentFallbackBackground =
  'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABlBMVEXf39////8zI3BgAAAAEUlEQVQIW2Nk38mIjH5wICMAez4Iyz2C/F8AAAAASUVORK5CYII=")';

export const ImageViewWrapper = styled.div`
  ${size()} border-radius: inherit;
  background-repeat: no-repeat, repeat;
  background-position: center, center;
  background-size: contain, auto;

  ${(props: ImageViewWrapperProps) => {
    let styles = '';

    if (props.isCropped) {
      styles += `
        background-size: cover, auto;
      `;
    }

    if (props.fadeIn) {
      styles += `
        ${fadeIn}
      `;
    }

    return styles;
  }};
`;
