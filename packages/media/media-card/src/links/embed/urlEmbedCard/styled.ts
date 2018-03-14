/* tslint:disable variable-name */

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass, IframeHTMLAttributes } from 'react';

export const defaultWidth = 480;
export const defaultHeight = 180;
export const maxWidth = 480;
export const maxHeight = 360;

export interface WrapperProps {
  aspectRatio?: number;
  width?: number;
  height?: number;
}

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.div`
  position: relative;
  ${({ aspectRatio, width, height }: WrapperProps) => {
    if (width || height) {
      return `
        width: ${width || defaultWidth}px;
        height: ${height || defaultHeight}px;
        max-width: ${maxWidth}px;
        max-height: ${maxHeight}px;
      `;
    } else if (aspectRatio) {
      return `
        width: ${defaultWidth}px;
        /*
          - cannot use a % height when the parent container does not have a fixed height
          - padding-bottom % is calculated on the width of the parent container
         */
        height: 0;
        padding-bottom: ${1 / aspectRatio * 100}%;
      `;
    } else {
      return `
        width: ${defaultWidth}px;
        height: ${defaultHeight}px;
      `;
    }
  }};
`;

export const Iframe: ComponentClass<IframeHTMLAttributes<{}>> = styled.iframe`
  position: absolute;
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 3px;
`;
