import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, TableHTMLAttributes, ComponentClass } from 'react';
import {
  akEditorBlockquoteBorderColor,
  akEditorMentionSelected,
  akEditorTableBorderSelected,
  akEditorTableFloatingControls,
  akEditorRuleBackground,
  akEditorRuleBorderRadius,
  akEditorCodeBackground,
  akEditorCodeFontFamily,
  akEditorCodeBlockPadding,
} from '../../styles';
import {
  akGridSizeUnitless,
  akColorN20,
  akBorderRadius,
  akColorN40A,
  akColorN300,
} from '@atlaskit/util-shared-styles';
import { telepointerStyle } from '../../plugins/collab-edit/styles';
import { tableStyle } from '@atlaskit/editor-common';

const ContentStyles: ComponentClass<HTMLAttributes<{}>> = styled.div`
  /* Hack for ie11 that is being used in code block.
   * https://bitbucket.org/atlassian/atlaskit/src/ad09f6361109ece1aab316c8cbd8116ffb7963ef/packages/editor-core/src/schema/nodes/code-block.ts?fileviewer=file-view-default#code-block.ts-110
   */
  & .ie11 {
    overflow: visible;
    word-wrap: break-word;
  }

  .ProseMirror {
    word-wrap: break-word;
    white-space: pre-wrap;
    outline: none;
  }

  .ProseMirror .placeholder-decoration {
    position: absolute;
    width: 100%;
    pointer-events: none;
    user-select: none;

    &::before {
      content: attr(data-text);
      color: ${akColorN300};
      pointer-events: none;
    }
  }

  .ProseMirror span[data-placeholder] {
    color: ${akColorN300};
  }

  .ProseMirror blockquote {
    box-sizing: border-box;
    padding-left: ${akGridSizeUnitless * 2}px;
    border-left: 2px solid ${akEditorBlockquoteBorderColor};
    margin: ${akGridSizeUnitless * 1.5}px 0 0 0;
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
      content: '';
    }

    & p {
      display: block;
    }
  }

  .ProseMirror pre {
    box-sizing: border-box;
    white-space: pre-wrap;
    font-family: ${akEditorCodeFontFamily};
    background: ${akEditorCodeBackground};
    padding: ${akEditorCodeBlockPadding};
    border-radius: ${akBorderRadius};
  }

  .ProseMirror .code {
    padding: 2px 1px;
    background: ${akColorN20};
    border-radius: 3px;
    font-family: monospace;
    white-space: pre-wrap;

    &::before,
    &::after {
      vertical-align: text-top;
      display: inline-block;
      width: 3px;
      content: '';
    }
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 30px;
    cursor: default;
    box-sizing: border-box;
  }

  .ProseMirror ul ul,
  .ProseMirror ul ol,
  .ProseMirror ol ul,
  .ProseMirror ol ol {
    padding-left: 17px;
  }

  .ProseMirror li {
    position: relative;
    /* Dont do weird stuff with marker clicks */
    pointer-events: none;

    > p:not(:first-child) {
      margin: 4px 0 0 0;
    }
  }

  .ProseMirror ol {
    & > li,
    & > li > ol > li > ol > li > ol > li,
    & > li > ol > li > ol > li > ol > li > ol > li > ol > li > ol > li {
      list-style-type: decimal;
    }
    /* stylelint-disable selector-combinator-space-before */
    & > li > ol > li,
    & > li > ol > li > ol > li > ol > li > ol > li,
    &
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li {
      list-style-type: lower-alpha;
    }

    & > li > ol > li > ol > li,
    & > li > ol > li > ol > li > ol > li > ol > li > ol > li,
    &
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li
      > ol
      > li {
      list-style-type: lower-roman;
    }
  }
  /* stylelint-enable */
  .ProseMirror li > * {
    pointer-events: auto;
  }

  .ProseMirror hr {
    height: 0;
    border: 1px solid ${akEditorRuleBackground};
    border-radius: ${akEditorRuleBorderRadius};
    margin: 24px 0;
  }

  .ProseMirror-hideselection *::selection {
    background: transparent;
  }

  .ProseMirror-hideselection *::-moz-selection {
    background: transparent;
  }

  .ProseMirror-selectednode {
    outline: none;
  }

  .ProseMirror-selectednode:empty {
    outline: 2px solid #8cf;
  }

  .ProseMirror-selectednode .ak-mention {
    background: ${akEditorMentionSelected};
  }

  /* Make sure li selections wrap around markers */
  li.ProseMirror-selectednode {
    outline: none;
  }

  li.ProseMirror-selectednode::after {
    content: '';
    position: absolute;
    left: -32px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px solid #8cf;
    pointer-events: none;
  }

  .ProseMirror blockquote table,
  .ProseMirror blockquote table:last-child {
    display: inline-table;
  }
  .ProseMirror .telepointer ${/* sc-prop */ telepointerStyle} .ProseMirror img {
    max-width: 100%;
  }

  .ProseMirror .table-decoration {
    position: relative;
    left: 8px;
    top: 20px;
  }

  /* =============== SINGLE IMAGE STYLES ================== */
  && .ProseMirror {
    & [layout='full-width'] > div,
    & [layout='wide'] > div {
      margin-left: 50%;
      transform: translateX(-50%);
    }

    & [layout='wrap-left'] + [layout='wrap-right'],
    & [layout='wrap-right'] + [layout='wrap-left'] {
      clear: none;
      & + p {
        clear: both;
      }
      & > div {
        margin-left: 0;
        margin-right: 0;
      }
    }
  }

  /* =============== PLACEHOLDER CURSOR STYLES========= */

  & .ProseMirror-fake-text-cursor {
    display: inline;
    pointer-events: none;
    position: relative;
    height: 15px;
  }

  & .ProseMirror-fake-text-cursor::after {
    content: '';
    display: inline;
    top: 0;
    position: absolute;
    height: 100%;
    border-right: 1px solid rgba(0, 0, 0, 0.4);
  }

  /* =============== TABLE ================== */
  .ProseMirror {
    .table-container table ${tableStyle} .table-column-controls {
      position: relative;
    }
    .table-container.with-controls table {
      margin-left: 0;
      margin-right: 0;
    }
    .table-container.with-controls {
      margin-left: 8px;
    }
    .table-container table[data-number-column='true'] td:first-child {
      background-color: ${akEditorTableFloatingControls};
      width: 40px;
      text-align: center;
    }
  }

  /* =============== TABLE COLUMN RESIZING ================== */
  .ProseMirror.table-resizing {
    .table-container {
      position: relative;
    }
    .table-container.with-controls {
      margin-left: 0;
    }
    .table-shadow {
      pointer-events: none;
      display: none;
      position: absolute;
      top: 18px;
      bottom: 20px;
      width: 0;
    }
    .with-controls .table-shadow {
      display: block;
    }
    .table-shadow.-left {
      left: 0;
      background: linear-gradient(
        to left,
        rgba(99, 114, 130, 0) 0,
        ${akColorN40A} 100%
      );
    }
    .table-shadow.-right {
      background: linear-gradient(
        to right,
        rgba(99, 114, 130, 0) 0,
        ${akColorN40A} 100%
      );
    }
    .table-wrapper {
      overflow-x: auto;
      padding-top: 8px;
    }
    .table-column-controls {
      top: 20px;
    }
    .column-resize-handle {
      background-color: ${akEditorTableBorderSelected};
      position: absolute;
      bottom: 0;
      top: -1px;
      right: -2px;
      width: 2px;
      height: calc(100% + 2px);
      pointer-events: none;
      z-index: 20;
    }
    .with-controls .column-resize-handle {
      top: -11px;
      height: calc(100% + 11px);
    }
  }

  .ProseMirror.resize-cursor {
    cursor: col-resize;

    table td,
    table th {
      position: relative;
    }
  }
`;

export default ContentStyles;
