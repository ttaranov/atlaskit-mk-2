// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes } from 'react';

import {
  akBorderRadius,
  akColorN40,
  akColorN300,
  akColorN800,
  akColorN20,
  akCodeFontFamily,
} from '@atlaskit/util-shared-styles';

const akEditorCodeBackground = akColorN20;
const akEditorCodeBlockPadding = '12px';
const akEditorCodeFontFamily = akCodeFontFamily;

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  & .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 12px 20px;

    & blockquote {
      border-left: 4px solid ${akColorN40};
      color: ${akColorN300};

      &::before,
      &::after {
        content: none;
      }
      & > *:last-child {
        display: block;
      }
    }
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${akBorderRadius};
    }
    & .code,
    & code {
      padding: 1px 3px;
      border: 1px solid #ccc;
      border-radius: 3px;
      background: ${akEditorCodeBackground};
      font-size: 12px;
      line-height: 1.4;

      &::before,
      &::after {
        vertical-align: text-top;
        display: inline-block;
        width: 3px;
        content: '';
      }
    }
  }

  & div.toolsDrawer {
    padding: 8px 16px;
    background: ${akColorN800};

    & label {
      display: flex;
      color: white;
      align-self: center;
      padding-right: 8px;
    }

    & > div {
      /* padding: 4px 0; */
    }

    & button {
      margin: 4px 0;
    }
  }

  & legend {
    margin: 8px 0;
  }

  & input {
    font-size: 13px;
  }
`;
