/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass, keyframes } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, SVGProps } from 'react';
import { DropzoneProps } from './dropzone';

export const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  left: 0;
  top: 0;
  display: ${(props: DropzoneProps) => (props.isActive ? 'flex' : 'none')};
  text-align: center;
  z-index: 100;
  align-items: center;
  justify-content: center;
`;

const dropzoneAppear = keyframes`
  from {
    opacity: 0;
    transform: translate(0, 30px);
  }
`;

export const Content = styled.div`
  animation: ${dropzoneAppear} 0.5s;
`;

// TODO: Use AtlasKit color
// https://product-fabric.atlassian.net/browse/MSW-156
export const Label = styled.div`
  margin-top: 10px;
  font-size: 16px;
  color: #165ecc;
`;

/* needed to prevent child dragleave events */
export const Glass = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 101;
`;

export const StyledIcon = styled.svg`
  width: 70px;
  height: 70px;
`;

export const StyledSvgGroup = styled.g``;
