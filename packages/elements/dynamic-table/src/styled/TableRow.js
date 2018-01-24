// @flow
import styled from 'styled-components';
import { row } from '../theme';

export const TableBodyRow = styled.tr`
  &:hover {
    background: ${row.hoverBackground};
  }
`;
