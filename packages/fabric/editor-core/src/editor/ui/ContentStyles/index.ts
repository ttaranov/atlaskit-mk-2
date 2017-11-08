import styled from 'styled-components';
import {
  akEditorBlockquoteBorderColor,
  akEditorMentionSelected,
  akEditorTableCellSelected,
  akEditorTableBorder,
  akEditorTableBorderSelected,
  akEditorTableFloatingControls,
} from '../../../styles';
import {
  akGridSizeUnitless,
  akColorN80,
} from '@atlaskit/util-shared-styles';
import { telepointerStyle } from '../../plugins/collab-edit/styles';

const tableStyle = `
  {
    border-collapse: collapse;
    margin: 20px 8px;
    width: auto;
    border: 1px solid ${akEditorTableBorder};

    & {
      * {
        box-sizing: border-box;
      }

      tbody {
        border-bottom: none;
      }
      th td {
        background-color: white;
        font-weight: normal;
      }
      th, td {
        min-width: 3em;
        height: 2.5em;
        vertical-align: top;
        border: 1px solid ${akEditorTableBorder};
        border-right-width: 0;
        border-bottom-width: 0;
        padding: 6px 10px;
        /* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
        background-clip: padding-box;

        & p {
          margin: 0;
        }
      }
      th {
        background-color: ${akEditorTableFloatingControls};
        font-weight: bold;
        text-align: left;
      }
      .selectedCell, .hoveredCell {
        position: relative;
        border-color: ${akEditorTableBorderSelected};
        border-width: 1px;
      }
      /* Give selected cells a blue overlay */
      .selectedCell:after {
        z-index: 2;
        position: absolute;
        content: "";
        left: 0; right: 0; top: 0; bottom: 0;
        background: ${akEditorTableCellSelected};
        opacity: 0.3;
        pointer-events: none;
      }
      .table-decoration {
        position: relative;
        left: -1px;
      }
    }
  }
`;

// tslint:disable-next-line:variable-name
export const StyledTable = styled.table`${tableStyle}`;

// tslint:disable-next-line:variable-name
const ContentStyles = styled.div`
  // Hack for ie11 that is being used in code block.
  // https://bitbucket.org/atlassian/atlaskit/src/ad09f6361109ece1aab316c8cbd8116ffb7963ef/packages/editor-core/src/schema/nodes/code-block.ts?fileviewer=file-view-default#code-block.ts-110
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

    &::before {
      content: attr(data-text);
      color: ${akColorN80};
    }
  }

  .ProseMirror ul, .ProseMirror ol {
    padding-left: 30px;
    cursor: default;
  }

  .ProseMirror blockquote {
    padding-left: ${akGridSizeUnitless * 2}px;
    border-left: 2px solid ${akEditorBlockquoteBorderColor};
    margin: ${akGridSizeUnitless * 1.5}px 0 0 0;
    margin-right: 0;

    [dir="rtl"] & {
      padding-left: 0;
      padding-right: ${akGridSizeUnitless * 2}px;
    }

    &:first-child {
      margin-top: 0;
    }

    &::before {
      content: "";
    }

    &::after {
      content: "";
    }
  }

  .ProseMirror pre {
    white-space: pre-wrap;
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

    & > li > ol > li,
    & > li > ol > li > ol > li > ol > li > ol > li,
    & > li > ol > li > ol > li > ol > li > ol > li > ol > li > ol > li > ol > li {
      list-style-type: lower-alpha;
    }

    & > li > ol > li > ol > li,
    & > li > ol > li > ol > li > ol > li > ol > li > ol > li,
    & > li > ol > li > ol > li > ol > li > ol > li > ol > li > ol > li > ol > li > ol > li {
      list-style-type: lower-roman;
    }
  }

  .ProseMirror li > * {
    pointer-events: auto
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

  li.ProseMirror-selectednode:after {
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
  .ProseMirror table ${tableStyle}

  .ProseMirror .telepointer ${telepointerStyle}

  .ProseMirror img {
    max-width: 100%;
  }
`;

export default ContentStyles;
