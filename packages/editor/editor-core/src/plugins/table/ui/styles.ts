import {
  akEditorTableCellSelected,
  akEditorTableBorderSelected,
  akEditorTableBorderDelete,
  akEditorTableCellDelete,
} from '../../../styles';
import { akColorN40A } from '@atlaskit/util-shared-styles';

export const tableStyles = `
  .table-wrapper {
    padding-right: 10px;
    margin-right: -10px;
  }

  /* =============== TABLE COLUMN RESIZING ================== */
  .ProseMirror.table-resizing {
    .with-controls .table-container[data-layout='full-width'] {
      margin-left: 50%;
      transform: translateX(-50%);
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
      padding-top: 12px;
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

  .ProseMirror .table-container table {
    .selectedCell, .hoveredCell {
      position: relative;
      border: 1px solid ${akEditorTableBorderSelected};
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
    .selectedCell.danger, .hoveredCell.danger {
      border: 1px solid ${akEditorTableBorderDelete};
    }
    .selectedCell.danger:after {
      background: ${akEditorTableCellDelete};
    }
  }

  .table-decoration {
    position: relative;
    left: -1px;
  }
`;
