import styled from 'styled-components';
import {
  akEditorTableCellSelected,
  akEditorTableBorder,
  akEditorTableBorderSelected,
  akEditorTableFloatingControls,
} from '../../styles';

const tableStyle = `
  {
    border-collapse: collapse;
    margin: 20px 8px;
    width: auto;
    border: 1px solid ${akEditorTableBorder};

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
        height: 2.5em;
        vertical-align: top;
        border: 1px solid ${akEditorTableBorder};
        border-right-width: 0;
        border-bottom-width: 0;
        padding: 6px 10px;
        /* https://stackoverflow.com/questions/7517127/borders-not-shown-in-firefox-with-border-collapse-on-table-position-relative-o */
        background-clip: padding-box;

        & p {
          margin: 0;
        }
      }
      th {
        background-color: ${akEditorTableFloatingControls};
        font-weight: bold;
        text-align: left;
      }
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
  }
`;

// tslint:disable-next-line:variable-name
const StyledTable = styled.table`${tableStyle}`;
export default StyledTable;
