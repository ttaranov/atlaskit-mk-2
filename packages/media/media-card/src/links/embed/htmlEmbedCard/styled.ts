/* tslint:disable variable-name */

import styled, { ThemedOuterStyledProps } from 'styled-components';

import { ComponentClass, IframeHTMLAttributes } from 'react';

export interface IFrameProps {
  isLoading: boolean;
}

export const Iframe: ComponentClass<
  IframeHTMLAttributes<{}> & ThemedOuterStyledProps<IFrameProps, {}>
> = styled.iframe`
  border: none;
  border-radius: 3px;

  ${({ isLoading }: IFrameProps) => {
    if (isLoading) {
      return `
        visibility: hidden;
        overflow: hidden;
        width: 480px;
        height: 360px;
      `;
    } else {
      return '';
    }
  }};
`;
