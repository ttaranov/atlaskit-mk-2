import styled from 'styled-components';
import {
  LinkHTMLAttributes,
  ImgHTMLAttributes,
  HTMLAttributes,
  ComponentClass,
} from 'react';
import { akColorN20, akBorderRadius } from '@atlaskit/util-shared-styles';

export const A: ComponentClass<LinkHTMLAttributes<{}>> = styled.a`
  border-radius: ${akBorderRadius};
  padding: 2px;

  /* Outline looks bad when link has wrapped */
  outline: none;

  &:hover {
    text-decoration: none;
    background-color: ${akColorN20};
    text-decoration: underline;
  }
`;

export const Img: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  /* Hide alt text when image fails to load */
  display: inline-block;
  overflow: hidden;

  width: 16px;
  height: 16px;
  margin-right: 2px;
  vertical-align: text-bottom;
`;

export const LozengeWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  vertical-align: text-bottom;
  margin-left: 4px;
`;
