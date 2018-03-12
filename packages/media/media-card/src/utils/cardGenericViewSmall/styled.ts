/* tslint:disable:variable-name */
import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { Root, cardShadow, antialiased, easeOutExpo } from '../../styles';
import { center, ellipsis, borderRadius, size } from '@atlaskit/media-ui';
import {
  akColorN20,
  akColorN70,
  akColorB300,
} from '@atlaskit/util-shared-styles';

const imgSize = 32;

export interface SmallCardProps {
  hasError: boolean;
}

export const SmallCard: ComponentClass<
  HTMLAttributes<{}> & SmallCardProps
> = styled(Root)`
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

export const Retry: ComponentClass<HTMLAttributes<{}>> = styled.div`
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

export const ImgWrapper: ComponentClass<
  HTMLAttributes<{}> & ImgWrapperProps
> = styled.div`
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

export const ErrorWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div``;

export const Error: ComponentClass<HTMLAttributes<{}>> = styled.div`
  ${antialiased} ${ellipsis()} font-weight: bold;
  color: ${akColorN70};
  font-size: 12px;
  line-height: 15px;
`;

export const InfoWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
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

export const ActionsWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  ${center};
`;
