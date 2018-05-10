/* tslint:disable:variable-name */
import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { size, fadeIn } from '@atlaskit/media-ui';

export interface ImageViewWrapperProps {
  fadeIn?: boolean;
  isCropped?: boolean;
}

export const transparentFallbackBackground =
  'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABlBMVEXf39////8zI3BgAAAAEUlEQVQIW2Nk38mIjH5wICMAez4Iyz2C/F8AAAAASUVORK5CYII=")';

export const ImageViewWrapper: ComponentClass<
  HTMLAttributes<{}> & ImageViewWrapperProps
> = styled.div`
  ${size()} background-repeat: no-repeat, repeat;
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
