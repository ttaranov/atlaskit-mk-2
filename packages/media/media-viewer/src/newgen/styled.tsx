// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, VideoHTMLAttributes, ImgHTMLAttributes, ComponentClass, ClassAttributes } from 'react';

export const Blanket = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #1b2638;
`;

export const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

export const ErrorMessage = styled.div`
  color: white;
`;

export const Img: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  max-width: 100%;
`;

export const Video: ComponentClass<VideoHTMLAttributes<{}>> = styled.video`
  max-width: 100%;
`;

export const PDFWrapper = styled.div``;
