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

export const tableMarginTop = 32;
export const tableMarginBottom = 20;
export const tableMarginSides = 8;

const tableSharedStyle = css`
  .table-container {
    position: relative;
    margin: 0 auto;
    box-sizing: border-box;
  }
  .table-container[data-number-column='true'] {
    padding-left: ${akEditorTableNumberColumnWidth - 1}px;
  }
  .table-container[data-layout='full-width'],
  .table-container[data-layout='wide'] {
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .table-container table {
    border-collapse: collapse;
    margin: ${tableMarginTop}px ${tableMarginSides}px ${tableMarginBottom}px;
    border: 1px solid ${akEditorTableBorder};
    font-size: ${fontSize}px;
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
