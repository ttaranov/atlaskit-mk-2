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
import { TableCssClassName as ClassName } from '../types';

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
  > .${ClassName.CONTROLS_BUTTON_ICON} {
    display: inline-flex;
    max-height: 100%;
    max-width: 100%;
  }
  ${css}
`;

const HeaderButton = (css?: string) => `
  .${ClassName.CONTROLS_BUTTON} {
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
  .active .${ClassName.CONTROLS_BUTTON},
  .${ClassName.HOVERED_TABLE} .${ClassName.CONTROLS_BUTTON},
  .${ClassName.CONTROLS_BUTTON}:hover {
    background-color: ${tableToolbarSelectedColor};
    border-color: ${tableBorderSelectedColor};
  }
  .danger .${ClassName.CONTROLS_BUTTON} {
    background-color: ${tableToolbarDeleteColor};
    border-color: ${tableBorderDeleteColor};
    position: relative;
    z-index: ${akEditorUnitZIndex};
  }
`;

const InsertButton = (css?: string) => `
  .${ClassName.CONTROLS_INSERT_BUTTON_INNER} {
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
    .${ClassName.CONTROLS_INSERT_BUTTON} {
      ${Button()}
    }
  }
`;

const DeleteButton = (css?: string) => `
  .${ClassName.CONTROLS_DELETE_BUTTON_WRAP} {
    position: absolute;
    height: ${tableDeleteButtonSize}px;
    width: ${tableDeleteButtonSize}px;
    cursor: pointer;
    ${css}

    .${ClassName.CONTROLS_DELETE_BUTTON} {
      ${Button(`
        background: ${akColorN20A};
        color: ${akColorN300};
        :hover {
          background: ${akColorR300};
          color: white;
        }
      `)}
      .${ClassName.CONTROLS_BUTTON_ICON},
      .${ClassName.CONTROLS_BUTTON_ICON} svg {
        width: 16px;
        height: 16px;
      }
    }
  }
`;

const InsertLine = (css?: string) => `
  .${ClassName.CONTROLS_INSERT_LINE} {
    background: ${tableBorderSelectedColor};
    display: none;
    position: absolute;
    z-index: ${akEditorUnitZIndex};
    ${css}
  }
`;

const InsertMarker = (css?: string) => `
  .${ClassName.CONTROLS_INSERT_MARKER} {
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
    .${ClassName.COLUMN_CONTROLS} {
      height: ${tableToolbarSize}px;
      box-sizing: border-box;
      display: none;

      .${ClassName.COLUMN_CONTROLS_INNER} {
        display: flex;
        & > div.last > button {
          border-top-right-radius: ${tableBorderRadiusSize}px;
        }
      }
      .${ClassName.COLUMN_CONTROLS_BUTTON_WRAP} {
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
    .${ClassName.COLUMN_CONTROLS},
    .${ClassName.CORNER_CONTROLS} {
      ${DeleteButton(`
        top: -${tableDeleteButtonSize + 4}px;
      `)}
      .${ClassName.CONTROLS_INSERT_BUTTON_WRAP} {
        position: absolute;
        height: ${tableInsertColumnButtonSize}px;
        width: ${tableInsertColumnButtonSize}px;
        z-index: ${akEditorSmallZIndex};
        cursor: pointer;
        &:hover > div {
          display: flex;
        }
      }
      .${ClassName.CONTROLS_INSERT_COLUMN} {
        top: -${tableInsertColumnButtonSize}px;
        right: -${tableInsertColumnButtonSize / 2}px;
      }
      .${ClassName.CONTROLS_INSERT_ROW} {
        top: 2px;
        left: -${tableDeleteButtonSize + 4}px;
      }
    }
    .${ClassName.COLUMN_CONTROLS},
    .${ClassName.CONTROLS_INSERT_COLUMN} {
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
    .${ClassName.ROW_CONTROLS},
    .${ClassName.CONTROLS_INSERT_ROW} {
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
    .${ClassName.CORNER_CONTROLS} {
      width: ${tableToolbarSize + 1}px;
      height: ${tableToolbarSize + 1}px;
      display: none;
    }
    .${ClassName.CONTROLS_CORNER_BUTTON} {
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
    .${ClassName.HOVERED_TABLE} .${ClassName.CONTROLS_CORNER_BUTTON},
    .active .${ClassName.CONTROLS_CORNER_BUTTON},
    .${ClassName.CONTROLS_CORNER_BUTTON}:hover {
      border-color: ${tableBorderSelectedColor};
      background: ${tableToolbarSelectedColor};
    }
    .${ClassName.CONTROLS_CORNER_BUTTON}.danger {
      border-color: ${tableBorderDeleteColor};
      background: ${tableToolbarDeleteColor};
    }
    .${ClassName.TABLE_CONTAINER}[data-number-column='true'] {
      .${ClassName.CORNER_CONTROLS},
      .${ClassName.CONTROLS_CORNER_BUTTON} {
        width: ${akEditorTableToolbarSize + akEditorTableNumberColumnWidth}px;
      }
      .${ClassName.ROW_CONTROLS} .${ClassName.CONTROLS_BUTTON} {
        border-right-width: 0;
      }
    }

    /* Row controls */
    .${ClassName.ROW_CONTROLS} {
      width: ${tableToolbarSize}px;
      box-sizing: border-box;
      display: none;

      .${ClassName.ROW_CONTROLS_INNER} {
        display: flex;
        flex-direction: column;
        & > div.${ClassName.ROW_CONTROLS_BUTTON_WRAP}.last > button {
          border-bottom-left-radius: ${tableBorderRadiusSize}px;
        }
      }
      .${ClassName.ROW_CONTROLS_BUTTON_WRAP} {
        position: relative;
        margin-top: -1px;
        &.active {
          z-index: ${akEditorUnitZIndex};
        }
      }
      .${ClassName.CONTROLS_INSERT_BUTTON_WRAP} {
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
    .${ClassName.NUMBERED_COLUMN} {
      position: relative;
      float: right;
      margin-left: ${akEditorTableToolbarSize - 1}px;
      top: ${akEditorTableToolbarSize}px;
      width: ${akEditorTableNumberColumnWidth + 1}px;
      box-sizing: border-box;
      border-left: 1px solid ${akEditorTableBorder};
    }
    .${ClassName.NUMBERED_COLUMN_BUTTON} {
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
    .${ClassName.WITH_CONTROLS} {
      .${ClassName.COLUMN_CONTROLS},
      .${ClassName.CORNER_CONTROLS},
      .${ClassName.ROW_CONTROLS} {
        display: block;
      }
      .${ClassName.NUMBERED_COLUMN} {
        border-left: 0 none;
        padding-left: 1px;

        .${ClassName.NUMBERED_COLUMN_BUTTON} {
          cursor: pointer;
        }
        .${ClassName.NUMBERED_COLUMN_BUTTON}:hover,
        .${ClassName.NUMBERED_COLUMN_BUTTON}.active,
        .${ClassName.NUMBERED_COLUMN_BUTTON}.${ClassName.HOVERED_TABLE} {
          border-bottom: 1px solid ${tableBorderSelectedColor};
          border-color: ${tableBorderSelectedColor};
          background-color: ${tableToolbarSelectedColor};
          position: relative;
          z-index: ${akEditorUnitZIndex};
          color: ${akColorN0};
        }
        .${ClassName.NUMBERED_COLUMN_BUTTON}.danger {
          background-color: ${tableToolbarDeleteColor};
          border: 1px solid ${tableBorderDeleteColor};
          color: ${akColorR500};
          position: relative;
          z-index: ${akEditorUnitZIndex};
        }
      }
    }

    /* Table */
    .${ClassName.TABLE_NODE_WRAPPER} > table {
      table-layout: fixed;

      td,
      th {
        position: relative;
      }

      .${ClassName.SELECTED_CELL},
      .${ClassName.HOVERED_CELL} {
        position: relative;
        border: 1px solid ${tableBorderSelectedColor};
      }
      /* Give selected cells a blue overlay */
      .${ClassName.SELECTED_CELL}::after {
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
      .${ClassName.SELECTED_CELL}.danger,
      .${ClassName.HOVERED_CELL}.danger {
        border: 1px solid ${tableBorderDeleteColor};
      }
      .${ClassName.SELECTED_CELL}.danger::after {
        background: ${tableCellDeleteColor};
      }
    }
    .${ClassName.COLUMN_CONTROLS_WRAPPER},
    .${ClassName.ROW_CONTROLS_WRAPPER} {
      position: absolute;
      top: ${(isIE11 ? 0 : tableMarginTop) - tableToolbarSize}px;
    }
    .${ClassName.ROW_CONTROLS_WRAPPER}.scrolling {
      z-index: ${akEditorUnitZIndex};
    }
    .${ClassName.COLUMN_CONTROLS_WRAPPER} {
      left: 0;
    }
    .${ClassName.ROW_CONTROLS_WRAPPER} {
      left: -${tableToolbarSize}px;
    }
    .${ClassName.TABLE_NODE_WRAPPER} {
      padding-right: ${tableInsertColumnButtonSize / 2}px;
      margin-right: -${tableInsertColumnButtonSize / 2}px;
      z-index: ${akEditorUnitZIndex - 1};

      /* fixes gap cursor height */
      overflow: ${isIE11 ? 'none' : 'auto'};
      position: relative;
    }
  }

  /* =============== TABLE COLUMN RESIZING ================== */
  .ProseMirror.${ClassName.RESIZING} {
    .${ClassName.TABLE_SHADOW} {
      pointer-events: none;
      display: none;
      position: absolute;
      width: 0;

      top: ${tableMarginTop}px;
    }
    .${ClassName.WITH_CONTROLS} .${ClassName.TABLE_SHADOW} {
      top: ${tableMarginTop - tableToolbarSize + 1}px;
    }
    .${ClassName.TABLE_SHADOW} {
      display: ${isIE11 ? 'none' : 'block'};
      z-index: ${akEditorSmallZIndex};
    }
    .${ClassName.TABLE_SHADOW}.-left {
      left: 0;
      background: linear-gradient(
        to left,
        rgba(99, 114, 130, 0) 0,
        ${akColorN40A} 100%
      );
    }
    .${ClassName.TABLE_SHADOW}.-right {
      background: linear-gradient(
        to right,
        rgba(99, 114, 130, 0) 0,
        ${akColorN40A} 100%
      );
    }
    .${ClassName.TABLE_NODE_WRAPPER} {
      overflow-x: ${isIE11 ? 'none' : 'auto'};
      ${!isIE11 ? scrollbarStyles : ''};
    }
    .${ClassName.COLUMN_RESIZE_HANDLE} {
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
    .${ClassName.WITH_CONTROLS} .${ClassName.COLUMN_RESIZE_HANDLE} {
      top: -${tableToolbarSize}px;
      height: calc(100% + ${tableToolbarSize}px);
    }
  }

  .ProseMirror.resize-cursor {
    cursor: col-resize;
  }

  /* =============== TABLE CONTEXTUAL MENU ================== */
  .${ClassName.CONTEXTUAL_MENU_TRIGGER} {
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
  .${ClassName.CONTEXTUAL_SUBMENU} {
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
  .${ClassName.CONTEXTUAL_MENU_ICON} {
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
  .ProseMirror .${ClassName.TABLE_NODE_WRAPPER} > table {
    .${ClassName.SELECTED_CELL}.danger, .${ClassName.HOVERED_CELL}.danger {
      border: 1px solid ${tableBorderDeleteColor};
      background: ${tableCellDeleteColor};
    }
    .${ClassName.SELECTED_CELL}.danger:after {
      background: ${tableCellDeleteColor};
    }
    margin-left: 0;
    margin-right: 0;
    width: 100%;
  }
`;

export const tableCommentEditorStyles = css`
  .ProseMirror .${ClassName.TABLE_NODE_WRAPPER} > table {
    margin-left: 0;
    margin-right: 0;

    ${scrollbarStyles};
  }
`;
