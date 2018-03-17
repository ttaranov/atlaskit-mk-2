import * as React from 'react';
import styled from 'styled-components';

export interface ParagraphProps {
  indentLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

const ParagraphWrapper = styled.p`
  margin-left: ${({ indentLevel }: ParagraphProps) =>
    (indentLevel || 0) * 20}px;
`;

export default function Paragraph(props: ParagraphProps & React.Props<any>) {
  const { indentLevel, children } = props;
  return (
    <ParagraphWrapper indentLevel={indentLevel}>{children}</ParagraphWrapper>
  );
}
