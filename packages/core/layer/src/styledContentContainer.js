// @flow
import styled, { css } from 'styled-components';

export default styled.div`
  [data-role='droplistContent'] {
    ${({ maxHeight }) => (maxHeight ? `max-height: ${maxHeight}px` : '')};
  }
  ${({ fixedOffset }) =>
    fixedOffset &&
    css`
      position: fixed;
      top: ${fixedOffset};
    `};
`;
