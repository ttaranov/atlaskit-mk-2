// @flow
import styled from 'styled-components';

const fixedPositionMixin = offset =>
  offset ? `position: fixed; top: ${offset}px;` : '';

export const LayerContainer = styled.div`
  ${({ width, height }) =>
    width && height && `width: ${width}px; height: ${height}px;`};
`;

export const ContentContainer = styled.div`
  [data-role='droplistContent'] {
    ${({ maxHeight }) => (maxHeight ? `max-height: ${maxHeight}px` : '')};
  }
  ${({ fixedOffset }) => fixedPositionMixin(fixedOffset)};
`;

export const TriggerContainer = styled.div`
  ${({ fixedOffset }) => fixedPositionMixin(fixedOffset)};
`;
