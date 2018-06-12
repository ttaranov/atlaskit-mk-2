import styled from 'styled-components';
import { ImgHTMLAttributes, HTMLAttributes, ComponentClass } from 'react';

export const IconWrapper: ComponentClass<ImgHTMLAttributes<{}>> = styled.span`
  margin-right: 2px;
`;

export const OtherWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-left: 4px;
  display: inline-block;
  vertical-align: text-bottom;
`;
