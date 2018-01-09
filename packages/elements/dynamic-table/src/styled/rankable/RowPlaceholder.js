// @flow
import styled from 'styled-components';

export const RowPlaceholderCell = styled.td`
  padding: 0;
`;

export const RowPlaceholderWrapper = styled.div`
  height: ${({height}) => height}px;
  width: ${({width}) => width}px;
`;