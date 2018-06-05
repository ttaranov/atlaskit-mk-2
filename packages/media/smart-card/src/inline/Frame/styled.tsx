import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { akBorderRadius } from '@atlaskit/util-shared-styles';

export interface WrapperProps {
  isSelected?: boolean;
  isInteractive?: boolean;
}

const interactive = ({ isInteractive }: WrapperProps) => {
  if (isInteractive) {
    return `
      cursor: pointer;
      :hover, :focus {
        background-color: ${colors.N20};
      }
    `;
  } else {
    return '';
  }
};

const selected = ({ isSelected }: WrapperProps) => {
  if (isSelected) {
    return `
      background-color: ${colors.B50};
      :hover, :focus {
        background-color: ${colors.B50};
      }
    `;
  } else {
    return '';
  }
};

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & WrapperProps
> = styled.span`
  ${interactive} ${selected} display: inline-flex;
  align-items: center;
  padding: 2px;
  border-radius: ${akBorderRadius};
  user-select: none;
  vertical-align: middle;
`;
