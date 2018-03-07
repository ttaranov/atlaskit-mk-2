// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { akColorN30, akColorN40A } from '@atlaskit/util-shared-styles';
import { fadeIn } from '../../styles';

const borderRadius = `border-radius: 3px 3px 0 0;`;

export const Wrapper = styled.div`
  position: relative;
  height: 0;
  padding-bottom: 56.25%;
  color: ${akColorN40A};
  ${borderRadius} background-color: ${akColorN30};
  ${fadeIn};
`;

export const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export interface ImageWrapperProps {
  url: string;
}

export const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  ${borderRadius} ${({ url }: ImageWrapperProps) => `
    background-image: url(${url});
    background-repeat: no-repeat, repeat;
    background-position: center, center;
    background-size: cover, auto;
  `};
`;
