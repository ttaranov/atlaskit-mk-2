/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ImgHTMLAttributes, ButtonHTMLAttributes } from 'react';
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

export const Container = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${akBorderRadius};
`;

export const Image = styled.img`
  position: absolute;
  /* Is needed so image is not selected, when dragged */
  -webkit-user-select: none; /* Chrome all / Safari all */
  -moz-user-select: none; /* Firefox all */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Likely future */
`;

export const containerPadding = 28;

const Mask = styled.div`
  position: absolute;
  top: ${containerPadding}px;
  bottom: ${containerPadding}px;
  left: ${containerPadding}px;
  right: ${containerPadding}px;
  box-shadow: 0 0 0 100px rgba(255, 255, 255, 0.5);
`;

export const RectMask = styled(Mask)`
  border-radius: ${akBorderRadius};
`;

export const CircularMask = styled(Mask)`
  border-radius: 500px;
`;

export const DragOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: move;
`;

export const RemoveImageContainer = styled.div`
  position: absolute;
  right: 4px;
  top: 4px;
`;

export const RemoveImageButton = styled.button`
  border-radius: ${akBorderRadius};
  background-color: transparent;
  width: 24px;
  height: 24px;
  border: none;
  cursor: pointer;
  padding: 0;

  &:hover {
    background-color: ${akColorN50A};
  }
`;
