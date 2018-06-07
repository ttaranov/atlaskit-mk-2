import styled from 'styled-components';
import { ImgHTMLAttributes, HTMLAttributes, ComponentClass } from 'react';

export const IconWrapper: ComponentClass<ImgHTMLAttributes<{}>> = styled.span`
  display: inline-flex;
  margin-right: 2px;
`;

export const OtherWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: inline-flex;
  margin-left: 4px;
`;
