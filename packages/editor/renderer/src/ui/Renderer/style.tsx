import { HTMLAttributes, ComponentClass } from 'react';
import {
  akColorB300,
  akColorB400,
  akColorN800,
  akColorN40,
  akColorN300,
  akColorN30A,
  akGridSizeUnitless,
  akTypographyMixins,
  akFontFamily,
  akFontSizeDefault,
} from '@atlaskit/util-shared-styles';
import styled from 'styled-components';

import { RendererAppearance } from './';

export interface Props {
  appearance?: RendererAppearance;
}

const getLineHeight = ({ appearance }: Props) => {
  return `line-height: ${appearance === 'message' ? 20 : 24}px`;
};

export const Wrapper: ComponentClass<Props & HTMLAttributes<{}>> = styled.div`
  ${getLineHeight};
  color: ${akColorN800};
  word-wrap: break-word;

  & span.akActionMark {
    color: ${akColorB400};
    text-decoration: none;

    &:hover {
      color: ${akColorB300};
      text-decoration: underline;
    }
  }

  & span.akActionMark {
    cursor: pointer;
  }

  & blockquote {
    margin: ${akGridSizeUnitless * 1.5}px 0 0 0;
    color: ${akColorN300};
    border-left: 2px solid ${akColorN40};
    padding-left: ${akGridSizeUnitless * 2}px;

    & :first-child {
      margin-top: 0;
    }

    & > :last-child {
      display: inline-block;
    }

    &::before {
      content: '';
    }

    &::after {
      content: '';
    }
  }

  & p,
  & .UnknownBlock {
    font-family: ${akFontFamily};
    font-size: ${akFontSizeDefault};
    font-weight: 400;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  & ul {
    list-style-type: disc;

    & ul {
      list-style-type: circle;
    }

    & ul ul {
      list-style-type: square;
    }

    & ul ul ul {
      list-style-type: disc;
    }

    & ul ul ul ul {
      list-style-type: circle;
    }

    & ul ul ul ul ul {
      list-style-type: square;
    }
  }

  & ol {
    list-style-type: decimal;

    & ol {
      list-style-type: lower-alpha;
    }

    & ol ol {
      list-style-type: lower-roman;
    }

    & ol ol ol {
      list-style-type: decimal;
    }

    & ol ol ol ol {
      list-style-type: lower-alpha;
    }

    & ol ol ol ol ol {
      list-style-type: lower-roman;
    }

    & ol ol ol ol ol ol {
      list-style-type: decimal;
    }

    & ol ol ol ol ol ol ol {
      list-style-type: lower-alpha;
    }

    & ol ol ol ol ol ol ol ol {
      list-style-type: lower-roman;
    }
  }

  & .akTaskList > ol,
  & .akDecisionList > ol {
    list-style-type: none;
  }

  & h1 {
    ${akTypographyMixins.h800 as any};
    &:first-child {
      margin-top: 0;
    }
  }

  & h2 {
    ${akTypographyMixins.h700 as any};
    &:first-child {
      margin-top: 0;
    }
  }

  & h3 {
    ${akTypographyMixins.h600 as any};
    &:first-child {
      margin-top: 0;
    }
  }

  & h4 {
    ${akTypographyMixins.h500 as any};
    &:first-child {
      margin-top: 0;
    }
  }

  & h5 {
    ${akTypographyMixins.h400 as any};
    &:first-child {
      margin-top: 0;
    }
  }

  & h6 {
    ${akTypographyMixins.h300 as any};
    &:first-child {
      margin-top: 0;
    }
  }

  & hr {
    border: none;
    background-color: ${akColorN30A};
    height: 2px;
    border-radius: 1px;
  }

  & img {
    max-width: 100%;
  }

  & div > .media-wrapped + .media-wrapped + *:not(.media-wrapped) {
    clear: both;
  }

  & .media-wrapped + div:not(.media-wrapped) {
    clear: both;
  }

  & .CodeBlock,
  & blockquote,
  & hr,
  & > div > div:not(.media-wrapped) {
    clear: both;
  }

  & .media-wrapped {
    & + h1,
    & + h2,
    & + h3,
    & + h4,
    & + h5,
    & + h6 {
      margin-top: 8px;
    }
  }

  & .wrap-left + .wrap-right,
  & .wrap-right + .wrap-left {
    margin-left: 0;
    margin-right: 0;
  }

  /*
   * We wrap CodeBlock in a grid to prevent it from overflowing the container of the renderer.
   * See ED-4159.
   */
  & .CodeBlock {
    max-width: 100%;
    /* -ms- properties are necessary until MS supports the latest version of the grid spec */
    /* stylelint-disable value-no-vendor-prefix, declaration-block-no-duplicate-properties */
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: auto 1fr;
    /* stylelint-enable */

    grid-template-columns: minmax(0, 1fr);

    & > span {
      /* stylelint-disable value-no-vendor-prefix */
      -ms-grid-row: 1;
      -ms-grid-column: 2;
      /* stylelint-enable */
      grid-column: 1;
    }
  }

  & .ApplicationCard,
  & .MediaGroup,
  & .CodeBlock {
    margin-top: 12px;
    &:first-child {
      margin-top: 0;
    }
  }
`;
