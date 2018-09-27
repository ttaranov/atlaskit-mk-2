// @flow
import { borderRadius, gridSize, colors } from '@atlaskit/theme';
import { withFocusWithin } from 'react-focus-within';
import styled, { css } from 'styled-components';

const transition = css`
  transition: all 200ms ease-in-out;
`;

export const ButtonWrapper = styled.div`
  line-height: 0;
  position: absolute;
  left: 0;
  opacity: ${({ isHidden }) => (isHidden ? 0 : 1)};
  ${transition};

  button {
    pointer-events: none;
  }
`;

export const PanelHeader = withFocusWithin(styled.div`
  background-color: ${props => props.isFocused && colors.N20};
  border-radius: ${borderRadius}px;
  display: flex;
  align-items: center;
  left: -${gridSize() * 3}px;
  padding: 2px 0 2px ${gridSize() * 3}px;
  position: relative;
  width: 100%;
  ${transition};

  ${ButtonWrapper} {
    opacity: ${props => props.isFocused && 1};
  }

  &:hover {
    background-color: ${colors.N20};
    cursor: pointer;

    ${ButtonWrapper} {
      opacity: 1;
    }
  }
`);
