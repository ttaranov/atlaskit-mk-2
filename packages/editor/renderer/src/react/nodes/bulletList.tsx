import * as React from 'react';
import styled from 'styled-components';
import { IndentLevel } from '../types';

const StyledBulletList = styled.ul`
  margin-left: ${({ indentLevel }: { indentLevel: IndentLevel }) =>
    (indentLevel || 0) * 30}px;
`;

export default function BulletList(
  props: { indentLevel: IndentLevel } & React.Props<any>,
) {
  const { indentLevel, children } = props;
  return (
    <StyledBulletList indentLevel={indentLevel}>{children}</StyledBulletList>
  );
}
