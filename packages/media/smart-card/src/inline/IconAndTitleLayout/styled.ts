import styled from 'styled-components';
import { ImgHTMLAttributes, HTMLAttributes, ComponentClass } from 'react';

export const IconWrapper: ComponentClass<ImgHTMLAttributes<{}>> = styled.span`
  display: inline-flex;
  vertical-align: text-bottom;
  margin-right: 2px;
  > * {
    display: inline-flex;
  }
`;

export const OtherWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-left: 4px;
  display: inline-block;
  vertical-align: text-bottom;
`;
