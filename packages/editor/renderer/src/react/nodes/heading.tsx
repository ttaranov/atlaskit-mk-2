import * as React from 'react';
import styled from 'styled-components';

export interface HeadingProps {
  indentLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const getStyledheading = level => styled[`h${level}`]`
  margin-left: ${({ indentLevel }: HeadingProps) => (indentLevel || 0) * 20}px;
`;

export default function Heading(props: HeadingProps & React.Props<any>) {
  const { level, indentLevel, children } = props;
  const HeadingTag = getStyledheading(level);
  return <HeadingTag indentLevel={indentLevel}>{children}</HeadingTag>;
}
