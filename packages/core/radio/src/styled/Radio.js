// @flow
import styled, { css } from 'styled-components';

type LabelProps = {
  isDisabled: boolean,
  isFullWidth: boolean,
};

export const Label = styled.label`
  align-items: flex-start;
  color: ${p => p.textColor}
    ${({ isDisabled }: LabelProps) =>
      isDisabled
        ? css`
            cursor: not-allowed;
          `
        : ''};
  display: flex;
`;

export const LabelText = styled.div`
  padding: 2px 4px;
`;

export const IconWrapper = styled.span`
  line-height: 0;
  flex-shrink: 0;
  color: ${p => p.circleColor};
  fill: ${p => p.dotColor};
  transition: all 0.2s ease-in-out;
  /* This is adding a property to the inner svg, to add a border to the radio */
  & circle:first-of-type {
    transition: stroke 0.2s ease-in-out;
    stroke: ${p => p.borderColor};
    stroke-width: 2;
  }
`;
