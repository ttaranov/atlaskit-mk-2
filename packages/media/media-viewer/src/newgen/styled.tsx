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

export const HeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 98px;
  opacity: 0.85;
  background-image: linear-gradient(to bottom, #0e1624, rgba(14, 22, 36, 0));
  color: #b8c7e0;
  padding-top: 15px;
  padding-left: 24px;
  box-sizing: border-box;
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
  color: #b8c7e0;
`;

export const Img: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  max-width: 100%;
`;

export const Video: ComponentClass<VideoHTMLAttributes<{}>> = styled.video`
  width: 100%;
  height: 100%;
`;

export const PDFWrapper = styled.div``;

export const ArrowsWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 40%;
  width: 100%;
`;

const ArrowWrapper = styled.div`
  flex: 1;
  padding: 20px;
`;

export const Arrow = styled.span`
  cursor: pointer;
`;

export const LeftWrapper = ArrowWrapper.extend`
  text-align: left;
`;

export const RightWrapper = ArrowWrapper.extend`
  text-align: right;
`;
