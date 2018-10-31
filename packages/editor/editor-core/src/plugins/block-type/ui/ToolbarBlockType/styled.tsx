import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

export const BlockTypeMenuItem: ComponentClass<
  HTMLAttributes<{}> & {
    tagName: string;
    selected?: boolean;
  }
> = styled.div`
  ${props => (props.selected ? `${props.tagName} { color: white }` : '')};
`;
