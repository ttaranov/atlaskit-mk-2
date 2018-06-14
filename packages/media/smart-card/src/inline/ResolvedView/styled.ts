import styled from 'styled-components';
import { ImgHTMLAttributes, ComponentClass, HTMLAttributes } from 'react';
import { colors } from '@atlaskit/theme';

export const Icon: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  /* Hide alt text when image fails to load */
  display: inline-block;
  overflow: hidden;

  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
`;

export interface TitleProps {
  isSelected?: boolean;
}

const selected = ({ isSelected }: TitleProps) => {
  if (isSelected) {
    return `
      &, :hover, :focus, :active {
        color: ${colors.N300};
        text-decoration: none;
      }
    `;
  } else {
    return '';
  }
};

export const Title: ComponentClass<HTMLAttributes<{}> & TitleProps> = styled.a`
  ${selected} &, :hover, :focus, :active {
    color: ${colors.B400};
    text-decoration: none;
  }
  font-size: 14px;
  line-height: ${16 / 14};
`;
