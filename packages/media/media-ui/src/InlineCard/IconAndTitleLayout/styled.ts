import styled from 'styled-components';
import { ImgHTMLAttributes, HTMLAttributes, ComponentClass } from 'react';

export const IconWrapper: ComponentClass<ImgHTMLAttributes<{}>> = styled.span`
  vertical-align: middle;
  display: inline-flex;
  overflow: hidden;
  > span {
    margin-top: -3px;
    height: 23px;
    width: 23px;
  }
`;

export const OtherWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-left: 4px;
  display: inline-block;
  vertical-align: text-bottom;
`;
