import styled from 'styled-components';
import { ComponentClass, HTMLAttributes } from 'react';
import { colors } from '@atlaskit/theme';

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
