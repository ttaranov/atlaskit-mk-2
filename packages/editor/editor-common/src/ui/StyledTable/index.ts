import * as React from 'react';
import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, TableHTMLAttributes } from 'react';
import { akEditorTableBorder } from '../../styles';
import { tableBackgroundColorNames } from '../../';

const tableStyle = `
  {
    border-collapse: collapse;
    margin: 20px 8px;
    width: auto;
    border: 1px solid ${akEditorTableBorder};
    table-layout: fixed;

    &[data-autosize="true"] {
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
      th, td {
        min-width: 3em;
        height: 3em;
        vertical-align: top;
        border: 1px solid ${akEditorTableBorder};
        border-right-width: 0;
        border-bottom-width: 0;
        padding: 10px;
        /* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
        background-clip: padding-box;

        th p:not(:first-of-type), td p:not(:first-of-type) {
          margin-top: 12px;
        }
      }
      th {
        background-color: ${tableBackgroundColorNames.get('grey')};
        font-weight: bold;
        text-align: left;
      }
    }
  }
`;

// tslint:disable-next-line:variable-name
const StyledTable: React.ComponentClass<HTMLAttributes<{}>> = styled.table`
  ${tableStyle};
`;

export { tableStyle };
export default StyledTable;
