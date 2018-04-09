import * as React from 'react';
import styled from 'styled-components';
import { IndentLevel } from '../types';

const StyledWrapper = styled.p`
  margin-left: ${({ indentLevel }: { indentLevel: IndentLevel }) =>
    (indentLevel || 0) * 30}px;
`;

export default function Paragraph(
  props: { indentLevel: IndentLevel } & React.Props<any>,
) {
  const { indentLevel, children } = props;
  return <StyledWrapper indentLevel={indentLevel}>{children}</StyledWrapper>;
}
