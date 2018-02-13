/* tslint:disable:variable-name */
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ImgHTMLAttributes } from 'react';
import {
  akColorB200,
  akBorderRadius,
  akGridSizeUnitless,
} from '@atlaskit/util-shared-styles';

export interface AvatarImageProps {
  isSelected: boolean;
}

const AvatarImage = styled.img`
  border-radius: ${akBorderRadius};
  cursor: pointer;
  ${({ isSelected }: AvatarImageProps) =>
    isSelected
      ? `
    box-shadow: 0px 0px 0px 1px white, 0px 0px 0px 3px ${akColorB200};
  `
      : ''};
`;

export const LargeAvatarImage = styled(AvatarImage)`
  width: ${akGridSizeUnitless * 9}px;
  height: ${akGridSizeUnitless * 9}px;
`;

export const SmallAvatarImage = styled(AvatarImage)`
  width: ${akGridSizeUnitless * 5}px;
  height: ${akGridSizeUnitless * 5}px;
`;

export const PredefinedAvatarViewWrapper = styled.div`
  ul {
    display: flex;
    flex-flow: row wrap;

    padding: 0;
    margin: 0;

    list-style-type: none;

    li {
      padding-right: 4px;
      padding-left: 4px;
      padding-bottom: 8px;
      margin: 0px;
    }
  }

  .header {
    display: flex;
    align-items: center;

    padding-top: 4px;
    padding-bottom: 8px;

    .description {
      padding-left: 8px;
    }

    .back-button {
      width: 32px;
      height: 32px;
      border-radius: 16px;

      align-items: center;
      justify-content: center;

      margin: 0px;
      padding: 0px;
    }
  }

  // hide tickbox and file type icon in overlay
  // because those are not necessary for avatars

  .tickbox {
    visibility: hidden;
  }

  .file-type-icon {
    visibility: hidden;
  }
`;
