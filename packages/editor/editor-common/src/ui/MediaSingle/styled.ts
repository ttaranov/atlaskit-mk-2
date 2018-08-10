import * as React from 'react';
import styled, { css } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';
import { MediaSingleLayout } from '../../schema';
import {
  akEditorFullPageMaxWidth,
  akEditorWideLayoutWidth,
  akEditorBreakoutPadding,
} from '../../styles';
import { akColorN200 } from '../../../node_modules/@atlaskit/util-shared-styles';

function float(layout: MediaSingleLayout): string {
  switch (layout) {
    case 'wrap-right':
      return 'right';
    case 'wrap-left':
      return 'left';
    default:
      return 'none';
  }
}

function calcWidth(
  layout: MediaSingleLayout,
  width: number,
  containerWidth: number,
): string {
  switch (layout) {
    case 'wrap-right':
    case 'wrap-left':
      return width > akEditorFullPageMaxWidth / 2
        ? 'calc(50% - 12px)'
        : `${width}px`;
    case 'wide':
      return `${Math.min(akEditorWideLayoutWidth, width)}px`;
    case 'full-width':
      return `${Math.min(width, containerWidth) - akEditorBreakoutPadding}px`;
    default:
      return width > akEditorFullPageMaxWidth ? '100%' : `${width}px`;
  }
}

const wrapMediaMargin = 16;
const mediaSingleMargin = 24;
const captionMargin = 28; /* 20px lineheight + 8px margin */

function calcMargin(layout: MediaSingleLayout, showCaption: boolean): string {
  switch (layout) {
    case 'wrap-right':
      return `${
        showCaption ? wrapMediaMargin - captionMargin / 2 : wrapMediaMargin
      }px auto ${
        showCaption ? wrapMediaMargin - captionMargin / 2 : wrapMediaMargin
      }px 24px`;

    case 'wrap-left':
      return `${
        showCaption ? wrapMediaMargin - captionMargin / 2 : wrapMediaMargin
      }px 24px ${
        showCaption ? wrapMediaMargin - captionMargin / 2 : wrapMediaMargin
      }px auto`;

    default:
      return `${
        showCaption ? mediaSingleMargin - captionMargin / 2 : mediaSingleMargin
      }px auto ${
        showCaption ? mediaSingleMargin - captionMargin / 2 : mediaSingleMargin
      }px auto`;
  }
}
export interface WrapperProps {
  layout: MediaSingleLayout;
  width: number;
  height: number;
  containerWidth: number;
  hasCaption: boolean;
}

/**
 * Can't use `.attrs` to handle highly dynamic styles because we are still
 * supporting `styled-components` v1.
 */
const MediaSingleDimensionHelper = ({
  width,
  height,
  layout,
  containerWidth,
  hasCaption,
}: WrapperProps) => css`
  width: ${calcWidth(layout, width, containerWidth)};
  max-width: ${containerWidth < akEditorFullPageMaxWidth
    ? '100%'
    : `${containerWidth}px`};
  float: ${float(layout)};
`;

export const Caption: React.ComponentClass<HTMLAttributes<{}>> = styled.div`
  & {
    color: red;
  }

  & figcaption {
    color: orange;
    /*color: ${akColorN200};*/
    font-size: 12px;
    font-weight: 400;
    line-height: 20px;

    margin-top: 8px;
    /*margin-bottom: 8px;*/
    display: block;

    .placeholder {
      color: blue;
      display: inline;
      text-style: italic;
    }

    .placeholder::before {
      content: 'Type a caption...';
    }

    br {
      display: none;
    }
  }

  .placeholder::after {
    content: 'Type a caption...';
    margin-left: 96px;
    color: green;
  }

  & figcaption.placeholder {
    margin-right: 96px;
  }

  .ProseMirror-hideselection {
    & div {
      .div {
        caret-color: transparent;
        color: green;
      }
    }
  }

  text-align: center;
  width: 100%;
`;

const Wrapper: React.ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.div`
  margin: ${p => calcMargin(p.layout, p.hasCaption)};

  ${MediaSingleDimensionHelper};
  position: relative;

  & > div {
    position: relative;
  }

  & > div:first-of-type {
    /* only apply to image */
    &::after {
      content: '';
      display: block;
      padding-bottom: ${p => p.height / p.width * 100}%;
    }

    & > div:first-of-type {
      position: absolute;
      height: 100%;
      width: 100%;

      & > div {
        height: 100%;
      }
    }
  }
`;
Wrapper.displayName = 'WrapperMediaSingle';

export default Wrapper;
