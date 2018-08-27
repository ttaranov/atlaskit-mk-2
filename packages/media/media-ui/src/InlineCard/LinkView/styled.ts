import styled from 'styled-components';
import { AnchorHTMLAttributes, ComponentClass } from 'react';

export const Link: ComponentClass<AnchorHTMLAttributes<{}>> = styled.a`
  cursor: pointer;
  margin: 2px;
`;
