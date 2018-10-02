// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import {
  akColorN40A,
  akColorB100,
  akColorB300,
  akColorB400,
  akColorN300,
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
  akColorN200,
  akColorN0,
  akColorR500,
} from '@atlaskit/util-shared-styles';
import {
  browser,
  tableMarginTop,
  tableSharedStyle,
  akEditorTableToolbarSize,
  akEditorUnitZIndex,
  akEditorSmallZIndex,
  akEditorTableNumberColumnWidth,
  akEditorTableBorder,
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
export const tableDeleteButtonSize = 16;
export const contextualMenuTriggerSize = 16;
export const contextualMenuDropdownWidth = 180;

const isIE11 = browser.ie_version === 11;

const Button = (css?: string) => `
  background: ${akColorB400};
  border-radius: ${akBorderRadius};
  border-width: 0px;
  display: inline-flex;
  max-width: 100%;
  height: auto;
  text-align: center;
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  transition: background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
  outline: none !important;
  cursor: pointer;
  color: white;
  :hover {
    background: ${akColorB300};
  }
  > .pm-button-icon {
    display: inline-flex;
    max-height: 100%;
    max-width: 100%;
  }
  ${css}
`;

const HeaderButton = (css?: string) => `
  .pm-table-controls__button {
    background: ${tableToolbarColor};
    border-top: 1px solid ${tableBorderColor};
    border-left: 1px solid ${tableBorderColor};
    display: block;
    box-sizing: border-box;
    padding: 0;
    cursor: pointer;

    :focus {
      outline: none;
    }
    ${css}
  }
  .active .pm-table-controls__button,
  .tableHovered .pm-table-controls__button,
  .pm-table-controls__button:hover {
    background-color: ${tableToolbarSelectedColor};
    border-color: ${tableBorderSelectedColor};
  }
  .danger .pm-table-controls__button {
    background-color: ${tableToolbarDeleteColor};
    border-color: ${tableBorderDeleteColor};
    position: relative;
    z-index: ${akEditorUnitZIndex};
  }
`;

const InsertButton = (css?: string) => `
  .pm-table-controls__insert-button-inner {
    position: absolute;
    z-index: ${akEditorUnitZIndex};
    display: none;
    width: 100%;
    ${css}

    button {
      width: 100%;
    }
    button * {
      width: 100%;
      height: 100%;
    }
    .pm-table-controls__insert-button {
      ${Button()}
    }
  }
`;

const DeleteButton = (css?: string) => `
  .pm-table-controls__delete-button-wrap {
    position: absolute;
    height: ${tableDeleteButtonSize}px;
    width: ${tableDeleteButtonSize}px;
    cursor: pointer;
    ${css}

    .pm-table-controls__delete-button {
      ${Button(`
        background: ${akColorN20A};
        color: ${akColorN300};
        :hover {
          background: ${akColorR300};
          color: white;
        }
      `)}
      .pm-button-icon,
      .pm-button-icon svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const InsertLine = (css?: string) => `
  .pm-table-controls__insert-line {
    background: ${tableBorderSelectedColor};
    display: none;
    position: absolute;
    z-index: ${akEditorUnitZIndex};
    ${css}
  }
`;

const InsertMarker = (css?: string) => `
  .pm-table-controls__insert-marker {
    background-color: ${tableBorderColor};
    position: absolute;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    ${css}
  }
`;

export const tableStyles = css`
  .ProseMirror {
    ${tableSharedStyle}

    /* Column controls */
    .pm-table-column-controls {
      height: ${tableToolbarSize}px;
      box-sizing: border-box;
      display: none;

      .pm-table-column-controls__inner {
        display: flex;
        & > div.last > button {
          border-top-right-radius: ${tableBorderRadiusSize}px;
        }
      }
      .pm-table-column-controls__button-wrap {
        position: relative;
        margin-right: -1px;
        &.active {
          z-index: ${akEditorUnitZIndex};
        }
      }
      ${HeaderButton(`
        border-right: 1px solid ${tableBorderColor};
        border-bottom: none;
        height: ${tableToolbarSize}px;
        width: 100%;
        &:hover {
          z-index: ${akEditorUnitZIndex};
          position: relative;
        }
      `)}
    }
    .pm-table-column-controls,
    .pm-table-corner-controls {
      ${DeleteButton(`
        top: -${tableDeleteButtonSize + 4}px;
      `)}
      .pm-table-controls__insert-button-wrap {
        position: absolute;
        height: ${tableInsertColumnButtonSize}px;
        width: ${tableInsertColumnButtonSize}px;
        z-index: ${akEditorSmallZIndex};
        cursor: pointer;
        &:hover > div {
          display: flex;
        }
      }
      .pm-table-controls__insert-column {
        top: -${tableInsertColumnButtonSize}px;
        right: -${tableInsertColumnButtonSize / 2}px;
      }
      .pm-table-controls__insert-row {
        top: 2px;
        left: -${tableDeleteButtonSize + 4}px;
      }
    }
    .pm-table-column-controls,
    .pm-table-controls__insert-column {
      ${InsertButton('top: 5px;')}
      ${InsertLine(`
        width: 2px;
        left: 8px;
        top: ${tableInsertColumnButtonSize}px;
      `)}
      ${InsertMarker(`
        bottom: 3px;
        left: 7px;
      `)}
    }
    .pm-table-row-controls,
    .pm-table-controls__insert-row {
      ${InsertButton('left: 5px;')}
      ${InsertLine(`
        height: 2px;
        top: 8px;
        left: ${tableInsertColumnButtonSize}px;
      `)}
      ${InsertMarker(`
        top: 7px;
        right: 3px;
      `)}
    }

    /* Corner controls */
    .pm-table-corner-controls {
      width: ${tableToolbarSize + 1}px;
      height: ${tableToolbarSize + 1}px;
      display: none;
    }
    .pm-table-corner-button {
      position: absolute;
      top: 0;
      width: ${tableToolbarSize + 1}px;
      height: ${tableToolbarSize + 1}px;
      border: 1px solid ${tableBorderColor};
      border-radius: 0;
      border-top-left-radius: ${tableBorderRadiusSize}px;
      background: ${tableToolbarColor};
      cursor: pointer;
      box-sizing: border-box;
      padding: 0;
      :focus {
        outline: none;
      }
    }
    .tableHovered .pm-table-corner-button,
    .active .pm-table-corner-button,
    .pm-table-corner-button:hover {
      border-color: ${tableBorderSelectedColor};
      background: ${tableToolbarSelectedColor};
    }
    .pm-table-corner-button.danger {
      border-color: ${tableBorderDeleteColor};
      background: ${tableToolbarDeleteColor};
    }
    .table-container[data-number-column='true'] {
      .pm-table-corner-controls,
      .pm-table-corner-button {
        width: ${akEditorTableToolbarSize + akEditorTableNumberColumnWidth}px;
      }
      .pm-table-row-controls .pm-table-controls__button {
        border-right-width: 0;
      }
    }

    /* Row controls */
    .pm-table-row-controls {
      width: ${tableToolbarSize}px;
      box-sizing: border-box;
      display: none;

      .pm-table-row-controls__inner {
        display: flex;
        flex-direction: column;
        & > div.table-row.last > button {
          border-bottom-left-radius: ${tableBorderRadiusSize}px;
        }
      }
      .pm-table-row-controls__button-wrap {
        position: relative;
        margin-top: -1px;
        &.active {
          z-index: ${akEditorUnitZIndex};
        }
      }
      .pm-table-controls__insert-button-wrap {
        position: absolute;
        bottom: -${tableInsertColumnButtonSize / 2}px;
        left: -${tableInsertColumnButtonSize}px;
        height: ${tableInsertColumnButtonSize}px;
        width: ${tableInsertColumnButtonSize}px;
        z-index: ${akEditorSmallZIndex};
        cursor: pointer;
        &:hover > div {
          display: flex;
        }
      }
      ${DeleteButton(`
        bottom: -${tableInsertColumnButtonSize / 2}px;
        left: -${tableDeleteButtonSize + 6}px;
      `)}
      ${HeaderButton(`
        border-bottom: 1px solid ${tableBorderColor};
        border-right: 1px solid ${tableBorderColor};
        border-radius: 0;
        height: 100%;
        width: ${tableToolbarSize + 1}px;
      `)}
    }

    /* numbered column */
    .pm-table-numbered-column {
      position: relative;
      float: right;
      margin-left: ${akEditorTableToolbarSize - 1}px;
      top: ${akEditorTableToolbarSize}px;
      width: ${akEditorTableNumberColumnWidth + 1}px;
      box-sizing: border-box;
      border-left: 1px solid ${akEditorTableBorder};
    }
    .pm-table-numbered-column__button {
      border-top: 1px solid ${akEditorTableBorder};
      border-right: 1px solid ${akEditorTableBorder};
      box-sizing: border-box;
      margin-top: -1px;
      padding: 10px 2px;
      text-align: center;
      background-color: ${tableToolbarColor};
      color: ${akColorN200};
      border-color: ${akEditorTableBorder};

      :first-child {
        margin-top: 0;
      }
      :last-child {
        border-bottom: 1px solid ${akEditorTableBorder};
      }
    }
    .with-controls {
      .pm-table-column-controls,
      .pm-table-corner-controls,
      .pm-table-row-controls {
        display: block;
      }
      .pm-table-numbered-column {
        border-left: 0 none;
        padding-left: 1px;

        .pm-table-numbered-column__button {
          cursor: pointer;
        }
        .pm-table-numbered-column__button:hover,
        .pm-table-numbered-column__button.active,
        .pm-table-numbered-column__button.tableHovered {
          border-bottom: 1px solid ${tableBorderSelectedColor};
          border-color: ${tableBorderSelectedColor};
          background-color: ${tableToolbarSelectedColor};
          position: relative;
          z-index: ${akEditorUnitZIndex};
          color: ${akColorN0};
        }
        .pm-table-numbered-column__button.danger {
          background-color: ${tableToolbarDeleteColor};
          border: 1px solid ${tableBorderDeleteColor};
          color: ${akColorR500};
          position: relative;
          z-index: ${akEditorUnitZIndex};
        }
      }
    }

    /* Table */
    .table-wrapper > table {
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
