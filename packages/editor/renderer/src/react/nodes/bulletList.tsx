import * as React from 'react';
import styled from 'styled-components';

export interface BulletListProps {
  indentLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

const BulletListWrapper = styled.ul`
  margin-left: ${({ indentLevel }: BulletListProps) => indentLevel * 20}px;
`;

export default function BulletList(props: BulletListProps & React.Props<any>) {
  const { indentLevel, children } = props;
  return (
    <BulletListWrapper indentLevel={indentLevel}>{children}</BulletListWrapper>
  );
}
