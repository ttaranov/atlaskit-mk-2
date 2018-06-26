import styled from 'styled-components';
import { ComponentClass, HTMLAttributes } from 'react';

export const IconWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  vertical-align: middle;
  display: inline-block;
  line-height: ${16 / 12};
`;
