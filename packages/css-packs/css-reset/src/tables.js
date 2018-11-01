//@flow
import { colors, gridSize, typography } from '@atlaskit/theme';
import evaluateInerStyles from 'evaluate-inner-styles';

const tableBorderWdth = 2;

export default evaluateInerStyles()`
  table {
    border-collapse: collapse;
    width: 100%;
  }

  thead,
  tbody,
  tfoot {
    border-bottom: ${tableBorderWdth}px solid ${colors.N40};
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
    ${typography.h600()};

    margin-bottom: ${gridSize()}px;
    text-align: left;
  }
`;
