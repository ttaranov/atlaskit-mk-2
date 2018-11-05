import * as React from 'react';
import styled, { css } from 'styled-components';

export type Props = {
  align: 'left' | 'right' | 'center';
  children: React.Props<any>;
};

const MarkWrapper: React.ComponentClass<
  React.HTMLAttributes<{}> & Props
> = styled.div`
  ${({ align }) =>
    align &&
    css`
      text-align: ${align};
    `};
`;

export default function Alignment(props: Props) {
  return <MarkWrapper align={props.align}>{props.children}</MarkWrapper>;
}
