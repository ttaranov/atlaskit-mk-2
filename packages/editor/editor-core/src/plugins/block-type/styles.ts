// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';
import { akEditorBlockquoteBorderColor } from '../../styles';

// TODO: move to shared
export const blocktypeStyles = css`
  .ProseMirror blockquote {
    box-sizing: border-box;
    padding-left: ${akGridSizeUnitless * 2}px;
    border-left: 2px solid ${akEditorBlockquoteBorderColor};
    margin: 1.142em 0 0 0;
    margin-right: 0;

    [dir='rtl'] & {
      padding-left: 0;
      padding-right: ${akGridSizeUnitless * 2}px;
    }

    &:first-child {
      margin-top: 0;
    }

    &::before {
      content: '';
    }

    &::after {
      content: none;
    }

    & p {
      display: block;
    }

    & table,
    & table:last-child {
      display: inline-table;
    }
  }

  .ProseMirror h1 {
    line-height: 1.166;
    font-size: 1.714em;
    margin-top: 2.857em;
    margin-bottom: 0px;

    &:first-child {
      margin-top: 0;
    }
  }

  .ProseMirror h2 {
    line-height: 1.2;
    font-size: 1.43em;
    margin-top: 2.571em;
    margin-bottom: 0px;

    &:first-child {
      margin-top: 0;
    }
  }

  .ProseMirror h3 {
    line-height: 1.5;
    font-size: 1.142em;
    margin-top: 2.585em;
    margin-bottom: 0px;

    &:first-child {
      margin-top: 0;
    }
  }

  .ProseMirror h4 {
    line-height: 1.428;
    font-size: 1em;
    margin-top: 1.714em;

    &:first-child {
      margin-top: 0;
    }
  }

  .ProseMirror h5 {
    line-height: 1.333;
    font-size: 0.857em;
    margin-top: 1.43em;

    &:first-child {
      margin-top: 0;
    }
  }

  .ProseMirror h6 {
    line-height: 1.454;
    font-size: 0.785em;
    margin-top: 1.42em;

    &:first-child {
      margin-top: 0;
    }
  }
`;
