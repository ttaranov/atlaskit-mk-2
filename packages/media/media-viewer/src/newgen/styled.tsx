// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, VideoHTMLAttributes, ImgHTMLAttributes, ComponentClass, ClassAttributes, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { colors } from '@atlaskit/theme';

export const Positioner = styled.div`
  background-color: ${colors.N900};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  z-index: 500;
`;

export const ErrorMessage = styled.div`
  color: white;
  font-weight: bold;
  text-align: center;
  width: 100%;
`;

export const Img: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  max-width: 100%;
  margin: auto;
  pointer-events: auto;
`;

export const Video: ComponentClass<VideoHTMLAttributes<{}>> = styled.video`
  max-width: 100%;
  margin: auto;
  pointer-events: auto;
`;

export const ArrowsWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 40%;
  width: 100%;
`;

export const ArrowWrapper = styled.div`
  flex: 1;
  padding: 20px;
`;

export const Arrow: ComponentClass<ButtonHTMLAttributes<{}>> = styled.button`
  background: transparent;
  border: none;
  padding: 0px;
  outline: none;
`;