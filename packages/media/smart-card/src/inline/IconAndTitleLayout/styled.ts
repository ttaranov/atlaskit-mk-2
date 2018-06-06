import styled from 'styled-components';
import { ImgHTMLAttributes, HTMLAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';

export const IconWrapper: ComponentClass<ImgHTMLAttributes<{}>> = styled.span`
  display: inline-block;
  margin-right: 2px;
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

export const TitleWrapper: ComponentClass<
  HTMLAttributes<{}> & TitleProps
> = styled.a`
  ${selected} &, :hover, :focus, :active {
    color: ${colors.B400};
    text-decoration: none;
  }
  font-size: 14px;
  line-height: ${16 / 14};
`;

export const OtherWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-left: 4px;
`;
