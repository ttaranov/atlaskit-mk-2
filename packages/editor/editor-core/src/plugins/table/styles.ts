import {
  akColorN20A,
  akColorN30,
  akColorN40A,
  akColorN90,
  akColorN80,
  akColorN60A,
  akBorderRadius,
  akColorG300,
  akColorR300,
  akColorR50,
  akColorN200,
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
    top: 1px;
    left: 180px;
    padding: 5px;

    &.-with-column-types {
      top: 30px;
    }
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
  .ProseMirror-column-types-submenu {
    &:after {
      content: '›';
      vertical-align: text-top;
      display: inline-block;
      width: 1px;
      position: relative;
      left: -5px;
      color: ${akColorN90};
    }
  }
  /* =============== TABLE CELL TYPE ================== */
  .ProseMirror {
    table {
      td[celltype="date"],
      td[celltype="mention"],
      td[celltype="emoji"],
      td[celltype="link"],
      td[celltype="checkbox"] {
        cursor: pointer;
      }

      td[celltype="number"],
      td[celltype="currency"] {
        text-align: right;
        padding-right: 20px;

        &.invalid {
          border: 1px solid ${akColorR300};
          background: ${akColorR50};
        }
      }

      td[celltype="currency"]:before {
        content: '$';
        float: left;
        color: ${akColorN200}
      }

      td[celltype="slider"] {
        caret-color: transparent;
      }

      td[celltype="summary"] {
        text-align: right;
        padding-right: 20px;
      }

      td[celltype="summary"]:before {
        content: attr(summarytype);
        text-transform: uppercase;
        color: ${akColorN80};
      }
   }

    .rangeslider{margin:20px 0;position:relative;background:#e6e6e6;-ms-touch-action:none;touch-action:none}.rangeslider,.rangeslider .rangeslider__fill{display:block;box-shadow:inset 0 1px 3px rgba(0,0,0,.4)}.rangeslider .rangeslider__handle{background:#fff;border:1px solid #ccc;cursor:pointer;display:inline-block;position:absolute;box-shadow:0 1px 3px rgba(0,0,0,.4),0 -1px 3px rgba(0,0,0,.4)}.rangeslider .rangeslider__handle .rangeslider__active{opacity:1}.rangeslider .rangeslider__handle-tooltip{width:40px;height:40px;text-align:center;position:absolute;background-color:rgba(0,0,0,.8);font-weight:400;font-size:14px;transition:all .1s ease-in;border-radius:4px;display:inline-block;color:#fff;left:50%;transform:translate3d(-50%,0,0)}.rangeslider .rangeslider__handle-tooltip span{margin-top:12px;display:inline-block;line-height:100%}.rangeslider .rangeslider__handle-tooltip:after{content:' ';position:absolute;width:0;height:0}.rangeslider-horizontal{height:12px;border-radius:10px}.rangeslider-horizontal .rangeslider__fill{height:100%;background-color:#7cb342;border-radius:10px;top:0}.rangeslider-horizontal .rangeslider__handle{width:30px;height:30px;border-radius:30px;top:50%;transform:translate3d(-50%,-50%,0)}.rangeslider-horizontal .rangeslider__handle:after{content:' ';position:absolute;width:16px;height:16px;top:6px;left:6px;border-radius:50%;background-color:#dadada;box-shadow:0 1px 3px rgba(0,0,0,.4) inset,0 -1px 3px rgba(0,0,0,.4) inset}.rangeslider-horizontal .rangeslider__handle-tooltip{top:-55px}.rangeslider-horizontal .rangeslider__handle-tooltip:after{border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid rgba(0,0,0,.8);left:50%;bottom:-8px;transform:translate3d(-50%,0,0)}.rangeslider-vertical{margin:20px auto;height:150px;max-width:10px;background-color:transparent}.rangeslider-vertical .rangeslider__fill,.rangeslider-vertical .rangeslider__handle{position:absolute}.rangeslider-vertical .rangeslider__fill{width:100%;background-color:#7cb342;box-shadow:none;bottom:0}.rangeslider-vertical .rangeslider__handle{width:30px;height:10px;left:-10px;box-shadow:none}.rangeslider-vertical .rangeslider__handle-tooltip{left:-100%;top:50%;transform:translate3d(-50%,-50%,0)}.rangeslider-vertical .rangeslider__handle-tooltip:after{border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:8px solid rgba(0,0,0,.8);left:100%;top:12px}.rangeslider-reverse.rangeslider-horizontal .rangeslider__fill{right:0}.rangeslider-reverse.rangeslider-vertical .rangeslider__fill{top:0;bottom:inherit}.rangeslider__labels{position:relative}.rangeslider-vertical .rangeslider__labels{position:relative;list-style-type:none;margin:0;padding:0;text-align:left;width:250px;height:100%;left:10px}.rangeslider-vertical .rangeslider__labels .rangeslider__label-item{position:absolute;transform:translate3d(0,-50%,0)}.rangeslider-vertical .rangeslider__labels .rangeslider__label-item::before{content:'';width:10px;height:2px;background:#000;position:absolute;left:-14px;top:50%;transform:translateY(-50%);z-index:-1}.rangeslider__labels .rangeslider__label-item{position:absolute;font-size:14px;cursor:pointer;display:inline-block;top:10px;transform:translate3d(-50%,0,0)}

    .slider {
      height: 0px;
    }
    ul.rangeslider__labels {
      margin: 0;
    }
    .rangeslider-horizontal {
      margin: 10px 0 0 0;
      height: 4px;
    }
    .rangeslider-horizontal .rangeslider__handle {
      width: 20px;
      height: 20px;
      outline: none;
    }
    .rangeslider-horizontal .rangeslider__handle:after {
      width: 12px;
      height: 12px;
      top: 3px;
      left: 3px;
    }
    .rangeslider .rangeslider__handle-tooltip {
      display: none;
    }

    .danger .rangeslider__fill {
      background-color: ${akColorG300};
    }
    .danger .rangeslider__fill {
      background-color: red;
      td[celltype="checkbox"] {
        width: 60px;
      }
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
