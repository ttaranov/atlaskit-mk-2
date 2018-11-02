import { css } from 'styled-components';
import { fontSize } from '@atlaskit/theme';
import { TableLayout } from '../../schema';
import {
  akEditorTableBorder,
  akEditorTableToolbar,
  akEditorWideLayoutWidth,
  akEditorTableNumberColumnWidth,
  akEditorBreakoutPadding,
} from '../consts';
import { PanelSharedCssClassName } from './panel';

export const tableMarginTop = 24;
export const tableMarginBottom = 16;
export const tableMarginSides = 8;

const clPrefix = 'pm-table-';

export const TableSharedCssClassName = {
  TABLE_CONTAINER: `${clPrefix}container`,
  TABLE_NODE_WRAPPER: `${clPrefix}wrapper`,
  TABLE_LEFT_SHADOW: `${clPrefix}with-left-shadow`,
  TABLE_RIGHT_SHADOW: `${clPrefix}with-right-shadow`,
};

const tableSharedStyle = css`
  .${TableSharedCssClassName.TABLE_CONTAINER} {
    position: relative;
    margin: 0 auto ${tableMarginBottom}px;
    box-sizing: border-box;

    /**
     * Fix block top alignment inside table cells.
     */
    .code-block,
    .${PanelSharedCssClassName.PANEL_CONTAINER},
    .taskItemView-content-wrap > div,
    .decisionItemView-content-wrap > div {
      margin-top: 0;
    }
  }
  .${TableSharedCssClassName.TABLE_CONTAINER}[data-number-column='true'] {
    padding-left: ${akEditorTableNumberColumnWidth - 1}px;
  }
  /* avoid applying styles to nested tables (possible via extensions) */
  .${TableSharedCssClassName.TABLE_CONTAINER} > table,
  .${TableSharedCssClassName.TABLE_NODE_WRAPPER} > table {
    border-collapse: collapse;
    margin: ${tableMarginTop}px ${tableMarginSides}px 0;
    border: 1px solid ${akEditorTableBorder};
    table-layout: fixed;
    font-size: ${fontSize()}px;
    width: 100%;

    &[data-autosize='true'] {
      table-layout: auto;
    }

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
      th,
      td {
        min-width: 128px;
        height: 3em;
        vertical-align: top;
        border: 1px solid ${akEditorTableBorder};
        border-right-width: 0;
        border-bottom-width: 0;
        padding: 10px;
        /* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
        background-clip: padding-box;

        th p:not(:first-of-type),
        td p:not(:first-of-type) {
          margin-top: 12px;
        }
      }
      th {
        background-color: ${akEditorTableToolbar};
        text-align: left;
        & * {
          font-weight: normal;
        }
        & > p {
          font-weight: bold;
        }
      }
    }
  }
`;

export const calcTableWidth = (
  layout: TableLayout,
  containerWidth?: number,
  addControllerPadding: boolean = true,
): string => {
  switch (layout) {
    case 'full-width':
      return containerWidth
        ? `${containerWidth -
            (addControllerPadding ? akEditorBreakoutPadding : 0)}px`
        : '100%';
    case 'wide':
      if (containerWidth) {
        const targetWidth =
          containerWidth - (addControllerPadding ? akEditorBreakoutPadding : 0);
        return targetWidth < akEditorWideLayoutWidth
          ? `${targetWidth}px`
          : `${akEditorWideLayoutWidth}px`;
      } else {
        return `${akEditorWideLayoutWidth}px`;
      }
    default:
      return 'inherit';
  }
};

export { tableSharedStyle };
