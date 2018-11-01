// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import { borderRadius, colors, fontSize } from '@atlaskit/theme';
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

const {
  N40A,
  B100,
  B300,
  N300,
  B75,
  N20,
  N50,
  R50,
  R300,
  R75,
  N20A,
  N60A,
  N30,
  N90,
  N200,
  N0,
  R500,
} = colors;

export const tableToolbarColor = N20;
export const tableBorderColor = N50;
export const tableFloatingControlsColor = N20;
export const tableCellSelectedColor = B75;
export const tableToolbarSelectedColor = B100;
export const tableBorderSelectedColor = B300;
export const tableCellDeleteColor = R50;
export const tableBorderDeleteColor = R300;
export const tableToolbarDeleteColor = R75;

export const tableToolbarSize = akEditorTableToolbarSize;
export const tableBorderRadiusSize = 3;
export const tableInsertColumnButtonSize = 20;
export const tableDeleteButtonSize = 16;
export const contextualMenuTriggerSize = 16;
export const contextualMenuDropdownWidth = 180;
export const layoutButtonSize = 32;

const isIE11 = browser.ie_version === 11;

const Button = (css?: string) => `
  border-radius: ${borderRadius()}px;
  border-width: 0px;
  display: inline-flex;
  max-width: 100%;
  text-align: center;
  margin: 0px;
  padding: 0px;
  text-decoration: none;
  transition: background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s;
  outline: none !important;
  cursor: pointer;

  > .${ClassName.CONTROLS_BUTTON_ICON} {
    display: inline-flex;
    max-height: 100%;
    max-width: 100%;
  }
  ${css}
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
    color: ${N0};
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

const InsertButton = () => `
  .${ClassName.CONTROLS_INSERT_BUTTON_INNER} {
    position: absolute;
    z-index: ${akEditorUnitZIndex};
  }
  .${ClassName.CONTROLS_INSERT_BUTTON_INNER},
  .${ClassName.CONTROLS_INSERT_BUTTON} {
    height: ${tableInsertColumnButtonSize}px;
    width: ${tableInsertColumnButtonSize}px;
  }
  .${ClassName.CONTROLS_INSERT_BUTTON} {
    ${Button(`
      background: white;
      box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
      color: ${N300};
      :hover {
        background: ${B300};
        color: white;
      }
    `)}
  }
  .${ClassName.CONTROLS_INSERT_LINE} {
    display: none;
  }
`;

const DeleteButton = (css?: string) => `
  .${ClassName.CONTROLS_DELETE_BUTTON_WRAP} {
    position: absolute;
    cursor: pointer;
    ${css}

    .${ClassName.CONTROLS_DELETE_BUTTON} {
      ${Button(`
        background: ${N20A};
        color: ${N300};
        :hover {
          background: ${R300};
          color: white;
        }
        height: ${tableDeleteButtonSize}px;
        width: ${tableDeleteButtonSize}px;
      `)}
    }
  }
`;

const InsertMarker = (css?: string) => `
  .${ClassName.CONTROLS_INSERT_MARKER} {
    background-color: ${tableBorderColor};
    position: absolute;
    height: 4px;
    width: 4px;
    border-radius: 50%;
    pointer-events: none;
    ${css}
  }
`;

export const tableStyles = css`
  .${ClassName.LAYOUT_BUTTON} button {
    background: ${N20A};
    color: ${N300};
    :hover {
      background: ${B300};
      color: white !important;
    }
  }

  .ProseMirror {
    ${tableSharedStyle}

    .less-padding {
      padding: 0 8px;

      .${ClassName.ROW_CONTROLS_WRAPPER} {
         padding: 0 8px;
      }
    }

    /* Breakout only works on top level */
    > .${ClassName.NODEVIEW_WRAPPER} .${
  ClassName.TABLE_CONTAINER
}[data-layout='full-width'],
    > .${ClassName.NODEVIEW_WRAPPER} .${
  ClassName.TABLE_CONTAINER
}[data-layout='wide'] {
      margin-left: 50%;
      transform: translateX(-50%);
    }
    > * .${ClassName.NODEVIEW_WRAPPER} .${ClassName.TABLE_CONTAINER} {
      width: 100% !important;
    }

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

        .${ClassName.CONTROLS_BUTTON_OVERLAY} {
          position: absolute;
          width: 50%;
          height: 30px;
          bottom: 0;
          right: 0;
        }
        .${ClassName.CONTROLS_BUTTON_OVERLAY}:first-child {
          left: 0;
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
        &:hover .${ClassName.CONTROLS_INSERT_LINE} {
          display: flex;
        }
      }
      .${ClassName.CONTROLS_INSERT_COLUMN} {
        top: -${tableInsertColumnButtonSize - 2}px;
        right: -${tableInsertColumnButtonSize / 2}px;
      }
      .${ClassName.CONTROLS_INSERT_ROW} {
        top: 2px;
        left: -${tableDeleteButtonSize + 2}px;
      }
    }
    .${ClassName.COLUMN_CONTROLS},
    .${ClassName.CONTROLS_INSERT_COLUMN} {
      ${InsertButton()}
      ${InsertLine(`
        width: 2px;
        left: 8px;
        top: ${tableInsertColumnButtonSize - 2}px;
      `)}
      ${InsertMarker(`
        bottom: 5px;
        left: 7px;
      `)}
    }
    .${ClassName.ROW_CONTROLS},
    .${ClassName.CONTROLS_INSERT_ROW} {
      ${InsertButton()}
      ${InsertLine(`
        height: 2px;
        top: 8px;
        left: ${tableInsertColumnButtonSize - 2}px;
      `)}
      ${InsertMarker(`
        top: 7px;
        right: 5px;
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
        left: -${tableInsertColumnButtonSize - 2}px;
        height: ${tableInsertColumnButtonSize}px;
        width: ${tableInsertColumnButtonSize}px;
        z-index: ${akEditorSmallZIndex};
        cursor: pointer;
        &:hover .${ClassName.CONTROLS_INSERT_LINE} {
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

        .${ClassName.CONTROLS_BUTTON_OVERLAY} {
          position: absolute;
          width: 30px;
          height: 50%;
          right: 0;
          bottom: 0;
        }
        .${ClassName.CONTROLS_BUTTON_OVERLAY}:first-child {
          top: 0;
        }
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
      font-size: ${fontSize()}px;
      background-color: ${tableToolbarColor};
      color: ${N200};
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
          color: ${N0};
        }
        .${ClassName.NUMBERED_COLUMN_BUTTON}.danger {
          background-color: ${tableToolbarDeleteColor};
          border: 1px solid ${tableBorderDeleteColor};
          color: ${R500};
          position: relative;
          z-index: ${akEditorUnitZIndex};
        }
      }
      /* scroll shadows */
      .${ClassName.TABLE_RIGHT_SHADOW},
      .${ClassName.TABLE_LEFT_SHADOW}::after {
        display: block;
        position: absolute;
        pointer-events: none;
        z-index: ${akEditorSmallZIndex};
        width: 8px;
      }
      .${ClassName.TABLE_LEFT_SHADOW}::after {
        background: linear-gradient(
          to left,
          rgba(99, 114, 130, 0) 0,
          ${N40A} 100%
        );
        content: '';
        height: 100%;
        right: -8px;
        bottom: 0;
      }
      .${ClassName.TABLE_RIGHT_SHADOW} {
        background: linear-gradient(
          to right,
          rgba(99, 114, 130, 0) 0,
          ${N40A} 100%
        );
        height: calc(100% - ${tableMarginTop - 1}px);
        left: calc(100% + 2px);
        top: ${tableMarginTop - tableToolbarSize + 1}px;
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
      top: ${tableMarginTop - 1}px;
    }
    .${ClassName.ROW_CONTROLS_WRAPPER}.${ClassName.TABLE_LEFT_SHADOW} {
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
      padding-top: ${tableInsertColumnButtonSize / 2}px;
      margin-top: -${tableInsertColumnButtonSize / 2}px;
      z-index: ${akEditorUnitZIndex - 1};
      /* fixes gap cursor height */
      overflow: ${isIE11 ? 'none' : 'auto'};
      position: relative;
    }
    .${ClassName.COLUMN_RESIZE_HANDLE} {
      bottom: 0;
      top: -1px;
      right: -2px;
      width: 2px;
      height: calc(100% + 2px);
    }
  }

  /* =============== TABLE COLUMN RESIZING ================== */
  .ProseMirror.${ClassName.RESIZING} {
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
  .${ClassName.CONTEXTUAL_MENU_BUTTON} {
    position: absolute;
    right: 2px;
    top: 2px;

    > div {
      background: ${N20};
      border-radius: ${borderRadius()}px;
      border: 2px solid ${N0};
      display: flex;
      height: ${contextualMenuTriggerSize + 2}px;
      flex-direction: column;
    }
    button {
      flex-direction: column;
      padding: 0;
    }
  }
  .${ClassName.CONTEXTUAL_SUBMENU} {
    border-radius: ${borderRadius()}px;
    background: white;
    box-shadow: 0 4px 8px -2px ${N60A}, 0 0 1px ${N60A};
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
    border: 1px solid ${N30};
    border-radius: ${borderRadius()}px;
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
      top: 9px;
      color: ${N90};
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
