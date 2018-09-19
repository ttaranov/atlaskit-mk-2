// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import {
  akColorN40A,
  akColorB100,
  akColorB300,
  akColorB75,
  akColorN20,
  akColorN50,
  akColorR50,
  akColorR300,
  akColorR75,
  akColorN20A,
  akBorderRadius,
  akColorN60A,
  akColorN30,
  akColorN90,
} from '@atlaskit/util-shared-styles';
import {
  browser,
  tableMarginTop,
  tableSharedStyle,
  akEditorTableToolbarSize,
  akEditorUnitZIndex,
  akEditorSmallZIndex,
} from '@atlaskit/editor-common';
import { scrollbarStyles } from '../../../ui/styles';

export const tableToolbarColor = akColorN20;
export const tableBorderColor = akColorN50;
export const tableFloatingControlsColor = akColorN20;
export const tableCellSelectedColor = akColorB75;
export const tableToolbarSelectedColor = akColorB100;
export const tableBorderSelectedColor = akColorB300;
export const tableCellDeleteColor = akColorR50;
export const tableBorderDeleteColor = akColorR300;
export const tableToolbarDeleteColor = akColorR75;

export const tableToolbarSize = akEditorTableToolbarSize;
export const tableBorderRadiusSize = 3;
export const tableInsertColumnButtonSize = 20;
export const tableDeleteColumnButtonSize = 16;
export const contextualMenuTriggerSize = 16;
export const contextualMenuDropdownWidth = 180;

const isIE11 = browser.ie_version === 11;

export const tableStyles = css`
  .ProseMirror {
    ${tableSharedStyle} .table-wrapper > table {
      table-layout: fixed;

      td,
      th {
        position: relative;
      }

      .selectedCell,
      .hoveredCell {
        position: relative;
        border: 1px solid ${tableBorderSelectedColor};
      }
      /* Give selected cells a blue overlay */
      .selectedCell::after {
        z-index: ${akEditorSmallZIndex};
        position: absolute;
        content: '';
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: ${tableCellSelectedColor};
        opacity: 0.3;
        pointer-events: none;
      }
      .selectedCell.danger,
      .hoveredCell.danger {
        border: 1px solid ${tableBorderDeleteColor};
      }
      .selectedCell.danger::after {
        background: ${tableCellDeleteColor};
      }
    }
    .table-column-controls-wrapper,
    .table-row-controls-wrapper {
      position: absolute;
      top: ${(isIE11 ? 0 : tableMarginTop) - tableToolbarSize}px;
    }
    .table-row-controls-wrapper.scrolling {
      z-index: ${akEditorUnitZIndex};
    }
    .table-column-controls-wrapper {
      left: 0;
    }
    .table-row-controls-wrapper {
      left: -${tableToolbarSize}px;
    }
    .table-wrapper {
      padding-right: ${tableInsertColumnButtonSize / 2}px;
      margin-right: -${tableInsertColumnButtonSize / 2}px;
      z-index: ${akEditorUnitZIndex - 1};

      /* fixes gap cursor height */
      overflow: ${isIE11 ? 'none' : 'auto'};
      position: relative;
    }
  }

  /* =============== TABLE COLUMN RESIZING ================== */
  .ProseMirror.table-resizing {
    .table-shadow {
      pointer-events: none;
      display: none;
      position: absolute;
      width: 0;

      top: ${tableMarginTop}px;
    }
    .with-controls .table-shadow {
      top: ${tableMarginTop - tableToolbarSize + 1}px;
    }
    .table-shadow {
      display: ${isIE11 ? 'none' : 'block'};
      z-index: ${akEditorSmallZIndex};
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
      overflow-x: ${isIE11 ? 'none' : 'auto'};
      ${!isIE11 ? scrollbarStyles : ''};
    }
    .column-resize-handle {
      background-color: ${tableBorderSelectedColor};
      position: absolute;
      bottom: 0;
      top: -1px;
      right: -2px;
      width: 2px;
      height: calc(100% + 2px);
      pointer-events: none;
      z-index: ${akEditorUnitZIndex};
    }
    .with-controls .column-resize-handle {
      top: -${tableToolbarSize}px;
      height: calc(100% + ${tableToolbarSize}px);
    }
  }

  .ProseMirror.resize-cursor {
    cursor: col-resize;
  }

  /* =============== TABLE CONTEXTUAL MENU ================== */
  .ProseMirror-table-contextual-menu-trigger {
    > div {
      background: ${akColorN20A};
      border-radius: ${akBorderRadius};
      display: flex;
      height: ${contextualMenuTriggerSize}px;
      flex-direction: column;
    }
    button {
      flex-direction: column;
      padding: 0;
    }
  }
  .ProseMirror-table-contextual-submenu {
    border-radius: ${akBorderRadius};
    background: white;
    box-shadow: 0 4px 8px -2px ${akColorN60A}, 0 0 1px ${akColorN60A};
    display: block;
    position: absolute;
    width: 130px;
    height: 64px;
    top: 0;
    left: ${contextualMenuDropdownWidth}px;
    padding: 5px;

    > div {
      padding: 0;
    }
  }
  .ProseMirror-contextual-submenu-icon {
    border: 1px solid ${akColorN30};
    border-radius: ${akBorderRadius};
    display: block;
    width: 20px;
    height: 20px;
    position: relative;
    left: -10px;

    &::after {
      content: '›';
      display: inline-block;
      width: 1px;
      position: relative;
      left: 25px;
      top: -3px;
      color: ${akColorN90};
    }
  }
`;

export const tableFullPageEditorStyles = css`
  .ProseMirror .table-wrapper > table {
    .selectedCell.danger,
    .hoveredCell.danger {
      border: 1px solid ${tableBorderDeleteColor};
      background: ${tableCellDeleteColor};
    }
    .selectedCell.danger:after {
      background: ${tableCellDeleteColor};
    }
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`;

export const tableCommentEditorStyles = css`
  .ProseMirror .table-wrapper > table {
    margin-left: 0;
    margin-right: 0;

    ${scrollbarStyles};
  }
`;
