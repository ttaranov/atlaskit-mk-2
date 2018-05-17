import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ImgHTMLAttributes, ComponentClass } from 'react';
import {
  akGridSizeUnitless,
  akBorderRadius,
  akColorN400,
  akColorN60A,
  akColorP400,
} from '@atlaskit/util-shared-styles';

export const ButtonContent: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  height: 24px;
  line-height: 24px;
  min-width: 70px;
`;

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: flex;
  margin-right: ${({ width }: { width?: 'small' | 'large' }) =>
    !width || width === 'large' ? 0 : akGridSizeUnitless}px;
`;

export const ConfirmationPopup: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background: #fff;
  border-radius: ${akBorderRadius};
  box-shadow: 0 4px 8px -2px ${akColorN60A}, 0 0 1px ${akColorN60A};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: auto;
  max-height: none;
  height: 410px;
  width: 280px;
`;

export const ConfirmationText: ComponentClass<HTMLAttributes<{}>> = styled.div`
  font-size: 14px;
  word-spacing: 4px;
  line-height: 22px;
  color: ${akColorN400};
  margin-top: 30px;
  padding: 20px;
  & > div {
    width: 240px;
  }
  & > div:first-of-type {
    margin-bottom: 12px;
  }
  & > div:nth-of-type(2) {
    margin-bottom: 20px;
  }
`;

export const ConfirmationHeader: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  background-color: ${akColorP400};
  height: 100px;
  width: 100%;
  display: inline-block;
`;

export const ConfirmationImg: ComponentClass<
  ImgHTMLAttributes<{}>
> = styled.img`
  width: 100px;
  display: block;
  margin: 25px auto 0 auto;
`;
