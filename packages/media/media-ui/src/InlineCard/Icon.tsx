import styled from 'styled-components';
import { ImgHTMLAttributes, ComponentClass } from 'react';

export const Icon: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  display: inline-block;
  overflow: hidden;
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
  margin-right: 2px;
`;
