import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { borderRadius as akBorderRadius } from '@atlaskit/theme';

export interface WrapperProps {
  isSelected?: boolean;
  isInteractive?: boolean;
}

const selected = `
  cursor: pointer;
  box-shadow: 0 0 0 2px ${colors.B100};
  outline: none;
`;

const isInteractive = ({ isInteractive }: WrapperProps) => {
  if (isInteractive) {
    return `
      cursor: pointer;
      :hover {
        background-color: ${colors.N20};
      }
      :active {
        background-color: ${colors.B50};
      }
      :focus {
        ${selected}
      }
    `;
  } else {
    return '';
  }
};

const isSelected = ({ isSelected }: WrapperProps) => {
  if (isSelected) {
    return selected;
  } else {
    return '';
  }
};

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.span`
  color: ${colors.N300};
  line-height: ${16 / 14};
  margin: 2px 2px 2px 0;
  padding: 1px 2px 2px 2px;
  border-radius: ${akBorderRadius()}px;
  user-select: none;
  ${isInteractive} ${isSelected};
`;
