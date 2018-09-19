//@flow
const colors = require('@atlaskit/theme/src/colors');
const { gridSize } = require('@atlaskit/theme/src');
const { h600 } = require('@atlaskit/theme/src/typography');
const css = require('./utils/evaluate-inner');

const table_border_width = 2;

module.exports = css`
  table {
    border-collapse: collapse;
    width: 100%;
  }

  thead,
  tbody,
  tfoot {
    border-bottom: ${table_border_width}px solid ${colors.N40};
  }

  td,
  th {
    border: none;
    padding: ${gridSize() / 2}px ${gridSize()}px;
    text-align: left;
  }

  th {
    vertical-align: top;
  }

  td:first-child,
  th:first-child {
    padding-left: 0;
  }

  td:last-child,
  th:last-child {
    padding-right: 0;
  }

  caption {
    ${h600()};

    margin-bottom: ${gridSize()}px;
    text-align: left;
  }
`;
