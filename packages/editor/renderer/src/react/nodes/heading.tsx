import * as React from 'react';
import styled from 'styled-components';
import { IndentLevel } from '../types';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingProps {
  indentLevel?: IndentLevel;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const getStyledheading = level => styled[`h${level}`]`
  margin-left: ${({ indentLevel }: HeadingProps) => (indentLevel || 0) * 30}px;
`;

export default function Heading(props: HeadingProps & React.Props<any>) {
  const { level, indentLevel, children } = props;
  const StyledHeading = getStyledheading(level);
  return <StyledHeading indentLevel={indentLevel}>{children}</StyledHeading>;
}
