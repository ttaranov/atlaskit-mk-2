/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import {
  Root,
  cardShadow,
  center,
  antialiased,
  ellipsis,
  borderRadius,
  easeOutExpo,
  size,
} from '../../styles';
import {
  akColorN20,
  akColorN70,
  akColorB300,
} from '@atlaskit/util-shared-styles';

const imgSize = 32;

export interface SmallCardProps {
  hasError: boolean;
}

export const SmallCard = styled(Root)`
  ${borderRadius} cursor: pointer;
  box-sizing: border-box;
  padding: 5px;
  display: flex;
  align-items: stretch;
  transition: 0.8s background-color ${easeOutExpo};

  ${({ hasError }: SmallCardProps) => {
    if (hasError) {
      return `
        cursor: default;
      `;
    }

    return '';
  }} &:hover {
    background-color: ${akColorN20};
  }

  &.loading {
    background: transparent;
    box-shadow: none;
    cursor: default;

    .title,
    .subtitle {
      ${borderRadius} color: transparent;
      background-color: ${akColorN20};
      height: 10px;
    }

    .subtitle {
      width: 50%;
    }
  }
`;

export const Retry = styled.div`
  ${antialiased} display: inline-block;
  font-weight: bold;
  color: #0065ff;
  font-size: 12px;
  line-height: 15px;
  margin-top: 2px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
    color: ${akColorB300};
  }
`;

export interface ImgWrapperProps {
  shadow: boolean;
}

export const ImgWrapper = styled.div`
  ${center} ${borderRadius} ${size(imgSize)} overflow: hidden;
  position: relative;
  float: left;

  .media-card.loading & {
    box-shadow: none;
  }

  ${({ shadow }: ImgWrapperProps) => (shadow && cardShadow) || ''} img {
    max-width: 100%;
    max-height: 100%;
  }
`;

export const ErrorWrapper = styled.div``;

export const Error = styled.div`
  ${antialiased} ${ellipsis()} font-weight: bold;
  color: ${akColorN70};
  font-size: 12px;
  line-height: 15px;
`;

export const InfoWrapper = styled.div`
  display: flex;
  padding-left: 8px;
  position: relative;
  width: 0;
  flex: 1;
  overflow: hidden;

  .media-card.loading & {
    height: 100%;
  }
`;

export const ActionsWrapper = styled.div`
  display: flex;
  ${center};
`;
