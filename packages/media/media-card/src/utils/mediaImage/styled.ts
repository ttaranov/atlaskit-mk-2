/* tslint:disable:variable-name */
import styled from 'styled-components';
import { ImgHTMLAttributes, ComponentClass } from 'react';
import { size, fadeIn } from '@atlaskit/media-ui';

export interface ImageViewWrapperProps {
  fadeIn?: boolean;
  isCropped?: boolean;
}

export const ImageViewWrapper: ComponentClass<
  ImgHTMLAttributes<{}> & ImageViewWrapperProps
> = styled.img`
  ${size()} ${(props: ImageViewWrapperProps) => {
    let styles = '';

    if (props.isCropped) {
      styles += `
        object-fit: cover;
      `;
    } else {
      styles += `
        object-fit: contain;
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
