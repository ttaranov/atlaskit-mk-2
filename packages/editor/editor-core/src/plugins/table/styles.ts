import {
  akColorN20A,
  akColorN30,
  akColorN40A,
  akColorN90,
  akColorN60A,
  akBorderRadius,
} from '@atlaskit/util-shared-styles';
import {
  tableSharedStyle,
  tableMarginTop,
  tableMarginSides,
  akEditorTableNumberColumnWidth,
} from '@atlaskit/editor-common';
import {
  akEditorTableBorderSelected,
  akEditorTableFloatingControls,
  akEditorTableToolbarSize,
  akEditorTableCellSelected,
} from '../../styles';

export const contextualMenuSize = 16;

export const tableEditorStyles = `
  .ProseMirror {
    .table-container table ${tableSharedStyle}
    .table-container table {
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
    .table-column-controls-wrapper {
      position: relative;
    }
    .table-container {
      position: relative;
      margin: 0 auto;
      box-sizing: border-box;
    }
    .table-container table[data-number-column='true'] td:first-child {
      background-color: ${akEditorTableFloatingControls};
      width: ${akEditorTableNumberColumnWidth}px;
      text-align: center;
    }
    .table-container[data-layout='full-width'] {
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }

  /* =============== TABLE RESIZE ================== */
  .ProseMirror.table-resizing {
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
    }
    .column-resize-handle {
      background-color: ${akEditorTableBorderSelected};
      position: absolute;
      display: none;
      bottom: 0;
      top: -${akEditorTableToolbarSize - 1}px;
      height: calc(100% + ${akEditorTableToolbarSize - 1}px);
      right: -2px;
      width: 2px;
      pointer-events: none;
      z-index: 20;
    }
    .with-controls .column-resize-handle {
      display: block;
    }
  }

  .ProseMirror.resize-cursor {
    cursor: col-resize;

    table td,
    table th {
      position: relative;
    }
  }

  /* =============== TABLE CONTEXTUAL MENU ================== */
  .ProseMirror-table-contextual-menu-trigger {
    > div {
      background: ${akColorN20A};
      border-radius: ${akBorderRadius};
      display: flex;
      height: ${contextualMenuSize}px;
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
    display: none;
    position: absolute;
    width: 130px;
    height: 64px;
    top: 0;
    left: 181px;
    padding: 5px;

    &.-open {
      display: block;
    }

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

    &:after {
      content: '›';
      vertical-align: text-top;
      display: inline-block;
      width: 1px;
      position: relative;
      left: 25px;
      top: -2px;
      color: ${akColorN90};
    }
  }
`;

// adjust table controls position in full-page editor
export const tableFullPageStyles = `
  .ProseMirror .table-container {
    table {
      margin-left: 0;
      margin-right: 0;
      width: 100%;
    }

    .table-column-controls {
      top: ${tableMarginTop - akEditorTableToolbarSize + 1}px;
      left: 0;
    }

    .table-side-controls {
      left: -${tableMarginSides + 3}px;

      .table-corner-controls {
        top: -${akEditorTableToolbarSize - 3}px;
        left: 0;
      }

      .table-row-controls {
        top: 3px;
        left: 0;
      }
    }


  }
`;
