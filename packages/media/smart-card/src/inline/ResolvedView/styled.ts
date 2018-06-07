import styled from 'styled-components';
import { ImgHTMLAttributes, ComponentClass } from 'react';

export const Icon: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  /* Hide alt text when image fails to load */
  display: inline-block;
  overflow: hidden;

  width: 16px;
  height: 16px;
  margin-right: 2px;
  vertical-align: text-bottom;
`;
