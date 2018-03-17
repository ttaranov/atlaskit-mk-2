import * as React from 'react';
import styled from 'styled-components';

export interface OrderedListProps {
  indentLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  start?: number;
}

const OrderedListWrapper = styled.ol`
  margin-left: ${({ indentLevel }: OrderedListProps) =>
    (indentLevel || 0) * 20}px;
`;

export default function OrderedList(
  props: OrderedListProps & React.Props<any>,
) {
  const { indentLevel, start, children } = props;
  return (
    <OrderedListWrapper start={start} indentLevel={indentLevel}>
      {children}
    </OrderedListWrapper>
  );
}
