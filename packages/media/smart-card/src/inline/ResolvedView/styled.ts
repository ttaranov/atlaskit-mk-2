import styled from 'styled-components';
import { ImgHTMLAttributes, HTMLAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';

export const Icon: ComponentClass<ImgHTMLAttributes<{}>> = styled.img`
  /* Hide alt text when image fails to load */
  display: inline-block;
  overflow: hidden;

  width: 16px;
  height: 16px;
  margin-right: 2px;
  vertical-align: text-bottom;
`;

export interface LinkProps {
  isSelected?: boolean;
}

const selected = ({ isSelected }: LinkProps) => {
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

export const Link: ComponentClass<HTMLAttributes<{}> & LinkProps> = styled.a`
  ${selected} &, :hover, :focus, :active {
    color: ${colors.B400};
    text-decoration: none;
  }
  font-size: 14px;
  line-height: ${16 / 14};
`;

export const LozengeWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: inline-flex;
  margin-left: 4px;
`;
