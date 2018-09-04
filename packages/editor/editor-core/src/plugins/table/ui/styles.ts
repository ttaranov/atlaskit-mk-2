// @ts-ignore: unused variable
// prettier-ignore
import { css, Styles, StyledComponentClass } from 'styled-components';
import {
  akColorN40A,
  akColorB100,
  akColorB300,
  akColorB75,
  akColorN20,
  akColorN40,
  akColorN50,
  akColorR50,
  akColorR300,
  akColorR75,
  akColorN20A,
  akBorderRadius,
  akColorN60A,
  akColorN30,
  akColorN90,
  akColorN100,
  akColorN200,
  akColorN80,
  akColorG300,
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
    ${tableSharedStyle} .table-container table {
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

  /* =============== TABLE PIE CHART ================== */
  .ProseMirror {
    .table-container.-hidden {
      .table-row-controls-wrapper,
      .table-column-controls-wrapper,
      .table-shadow {
        display: none;
      }
      .table-wrapper {
        height: 0;
        width: 0;
        overflow: hidden;
      }
    }

    .ProseMirror-chart-container {
      border: 1px solid ${akColorN30};
      border-radius: 5px;
      margin: 32px 0 20px;

      &:hover {
        border-color: ${akColorN50};
      }
      &.selected {
        border-color: ${akColorB300};
      }
    }
    .ProseMirror-timeline {
      position: relative;

      .ProseMirror-timeline_swimlanes {
        padding: 48px 12px 12px 12px;
      }

      .ProseMirror-timeline_grid {
        height: 100%;
        position: absolute;
        display: flex;

        .ProseMirror-timeline_month {
          top: 0px;
          border-left: 1px solid ${akColorN30};
          position: absolute;
          height: 100%;

          .ProseMirror-timeline_month_label {
            color: ${akColorN100};
            font-size: 11px;
            padding: 10px 20px;
          }
        }
      }
    }
    .ProseMirror-chart {
      display: flex;
      align-items: center;
      justify-content: space-around;
      max-width: 680px;
      cursor: pointer;
      padding: 16px;

      &.-legend-right {
        flex-direction: row-reverse;
      }

      .ProseMirror-chart_header {
        padding-bottom: 24px;
      }

      .ProseMirror-chart_legend {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        li:last-child {
          margin-bottom: 0;
        }

        .ProseMirror-chart_bullet {
          border-radius: 3px;
          display: inline-block;
          height: 12px;
          width: 12px;
        }
        .ProseMirror-chart_title {
          margin-left: 10px;
        }
      }
    }
  }

  /* =============== TABLE CELL TYPE ================== */
  .ProseMirror {
    table {
      .ProseMirror-tableHeader-nodeview {
        display: flex;
        margin-right: 12px;
      }
      .ProseMirror-tableHeader-nodeview-content {
        flex: 1;
      }
      .ProseMirror-tableHeader-button-container {
        height: 24px;
        width: 24px;
        border-radius: ${akBorderRadius};
        opacity: 0.5;
        &:hover {
          opacity: 1;
        }
      }

      td[celltype='date'],
      td[celltype='mention'],
      td[celltype='emoji'],
      td[celltype='link'],
      td[celltype='checkbox'] {
        cursor: pointer;
        caret-color: transparent;
      }
      td[celltype='checkbox'] {
        text-align: center;
      }
      td[celltype='emoji'] {
        text-align: right;
      }

      td[celltype='number'],
      td[celltype='currency'] {
        text-align: right;
        padding-right: 20px;

        &.invalid {
          border: 1px solid ${akColorR300};
          background: ${akColorR50};
        }
      }

      td[celltype='currency']:before {
        content: '$';
        float: left;
        color: ${akColorN200};
      }

      td[celltype='slider'],
      td[celltype='summary'] {
        caret-color: transparent;
      }

      td[celltype='summary'] {
        text-align: right;
        padding-right: 20px;
        line-height: 1;
      }

      td[celltype='summary']:before {
        content: attr(summarytype);
        text-transform: uppercase;
        color: ${akColorN80};
        font-size: 11px;
        font-weight: 500px;
        line-height: 1;
      }
      td[summarytype='people'] {
        text-align: left;
        p {
          margin-top: 4px;
          position: relative;
          text-align: right;
          > span {
            position: absolute;
            left: 0;
          }
        }
      }
      td[summarytype='count'] {
        p {
          margin-top: 4px;
        }
      }

      tr:not(:first-child) th:first-child button {
        display: none;
      }
    }
    /* Range Slider */
    .rangeslider {
      flex: 1;
      margin: 20px 20px 20px 0;
      position: relative;
      background: #e6e6e6;
      -ms-touch-action: none;
      touch-action: none;
    }
    .rangeslider,
    .rangeslider .rangeslider__fill {
      display: block;
    }
    .rangeslider .rangeslider__handle {
      cursor: pointer;
      display: inline-block;
      position: absolute;
    }
    .rangeslider .rangeslider__handle .rangeslider__active {
      opacity: 1;
    }
    .rangeslider .rangeslider__handle-tooltip {
      width: 40px;
      height: 40px;
      text-align: center;
      position: absolute;
      background-color: rgba(0, 0, 0, 0.8);
      font-weight: 400;
      font-size: 14px;
      transition: all 0.1s ease-in;
      border-radius: 4px;
      display: inline-block;
      color: #fff;
      left: 50%;
      transform: translate3d(-50%, 0, 0);
    }
    .rangeslider .rangeslider__handle-tooltip span {
      margin-top: 12px;
      display: inline-block;
      line-height: 100%;
    }
    .rangeslider .rangeslider__handle-tooltip:after {
      content: ' ';
      position: absolute;
      width: 0;
      height: 0;
    }
    .rangeslider-horizontal .rangeslider__fill {
      height: 100%;
      background-color: ${akColorG300};
      border-radius: 3px;
      top: 0;
    }
    .rangeslider-horizontal .rangeslider__handle {
      width: 30px;
      height: 30px;
      border-radius: 30px;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .rangeslider-horizontal .rangeslider__handle-tooltip {
      top: -55px;
    }
    .rangeslider-horizontal .rangeslider__handle-tooltip:after {
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid rgba(0, 0, 0, 0.8);
      left: 50%;
      bottom: -8px;
      transform: translate3d(-50%, 0, 0);
    }
    .rangeslider-vertical {
      margin: 20px auto;
      height: 150px;
      max-width: 10px;
      background-color: transparent;
    }
    .rangeslider-vertical .rangeslider__fill,
    .rangeslider-vertical .rangeslider__handle {
      position: absolute;
    }
    .rangeslider-vertical .rangeslider__fill {
      width: 100%;
      background-color: #7cb342;
      box-shadow: none;
      bottom: 0;
    }
    .rangeslider-vertical .rangeslider__handle {
      width: 30px;
      height: 10px;
      left: -10px;
      box-shadow: none;
    }
    .rangeslider-vertical .rangeslider__handle-tooltip {
      left: -100%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
    }
    .rangeslider-vertical .rangeslider__handle-tooltip:after {
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 8px solid rgba(0, 0, 0, 0.8);
      left: 100%;
      top: 12px;
    }
    .rangeslider-reverse.rangeslider-horizontal .rangeslider__fill {
      right: 0;
    }
    .rangeslider-reverse.rangeslider-vertical .rangeslider__fill {
      top: 0;
      bottom: inherit;
    }
    .rangeslider__labels {
      position: relative;
    }
    .rangeslider-vertical .rangeslider__labels {
      position: relative;
      list-style-type: none;
      margin: 0;
      padding: 0;
      text-align: left;
      width: 250px;
      height: 100%;
      left: 10px;
    }
    .rangeslider-vertical .rangeslider__labels .rangeslider__label-item {
      position: absolute;
      transform: translate3d(0, -50%, 0);
    }
    .rangeslider-vertical
      .rangeslider__labels
      .rangeslider__label-item::before {
      content: '';
      width: 10px;
      height: 2px;
      background: #000;
      position: absolute;
      left: -14px;
      top: 50%;
      transform: translateY(-50%);
      z-index: -1;
    }
    .rangeslider__labels .rangeslider__label-item {
      position: absolute;
      font-size: 14px;
      cursor: pointer;
      display: inline-block;
      top: 10px;
      transform: translate3d(-50%, 0, 0);
    }
    ul.rangeslider__labels {
      margin: 0;
    }
    .rangeslider-horizontal {
      height: 4px;
      border-radius: 3px;
      background: ${akColorN40};
    }
    .rangeslider-horizontal .rangeslider__handle {
      width: 14px;
      height: 14px;
      background: ${akColorG300};
      outline: none;
    }
    .rangeslider .rangeslider__handle-tooltip {
      display: none;
    }

    .slider {
      display: flex;
      align-items: center;
      width: 100%;
      height: 17px;
    }
    .slider__value {
      padding: 0 4px;
      background: ${akColorN20};
      color: ${akColorG300};
      border-radius: ${akBorderRadius};
      min-width: 32px;
      text-align: center;
    }
    /* Range Slider End */

    .danger {
      .rangeslider__fill {
        background-color: ${akColorR300};
        td[celltype='checkbox'] {
          width: 60px;
        }
      }
      .rangeslider__handle {
        background: ${akColorR300};
      }
      .slider__value {
        color: ${akColorR300};
      }
    }
  }
`;

export const tableFullPageEditorStyles = `
  .ProseMirror .table-container table {
    .selectedCell.danger, .hoveredCell.danger {
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

export const tableCommentEditorStyles = `
  .ProseMirror .table-container table {
    margin-left: 0;
    margin-right: 0;

    ${scrollbarStyles};
  }
`;
