import * as React from 'react';
import styled from 'styled-components';
import { IndentLevel } from '../types';

export interface OrderedListProps {
  indentLevel?: IndentLevel;
  start?: number;
}

const StyledOrderedList = styled.ol`
  margin-left: ${({ indentLevel }: OrderedListProps) =>
    (indentLevel || 0) * 30}px;
`;

export default function OrderedList(
  props: OrderedListProps & React.Props<any>,
) {
  const { indentLevel, start, children } = props;
  return (
    <StyledOrderedList start={start} indentLevel={indentLevel}>
      {children}
    </StyledOrderedList>
  );
}
