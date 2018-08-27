/* tslint:disable:variable-name */

import styled from 'styled-components';

import {
  HTMLAttributes,
  ComponentClass,
  ImgHTMLAttributes,
  ButtonHTMLAttributes,
} from 'react';
import { akBorderRadius, akColorN50A } from '@atlaskit/util-shared-styles';

// Using module augmentation to add crossOrigin attribute as it does not exist yet, PR has been opened in
// DefinitelyTyped for it
declare module 'react' {
  interface ImgHTMLAttributes<T> {
    alt?: string;
    crossOrigin?: 'anonymous' | 'use-credentials' | '';
    height?: number | string;
    sizes?: string;
    src?: string;
    srcSet?: string;
    useMap?: string;
    width?: number | string;
  }
}

export const Container: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${akBorderRadius};
`;

export const Image: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  position: absolute;
  /* Is needed so image is not selected, when dragged */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
  border-radius: ${akBorderRadius};
`;

export const containerPadding = 28;

const Mask: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  top: ${containerPadding}px;
  bottom: ${containerPadding}px;
  left: ${containerPadding}px;
  right: ${containerPadding}px;
  box-shadow: 0 0 0 100px rgba(255, 255, 255, 0.5);
`;

export const RectMask: ComponentClass<HTMLAttributes<{}>> = styled(Mask)`
  border-radius: ${akBorderRadius};
`;

export const CircularMask: ComponentClass<HTMLAttributes<{}>> = styled(Mask)`
  border-radius: 500px;
`;

export const DragOverlay: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: move;
`;

export const RemoveImageContainer: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
`;

export const RemoveImageButton: ComponentClass<
  ButtonHTMLAttributes<{}>
> = styled.button`
  border-radius: ${akBorderRadius};
  background-color: transparent;
  width: 24px;
  height: 24px;
  border: none;
  cursor: pointer;
  padding: 0;

  svg {
    position: absolute;
    top: 4px;
    left: 4px;
  }

  &:hover {
    background-color: ${akColorN50A};
  }
`;
