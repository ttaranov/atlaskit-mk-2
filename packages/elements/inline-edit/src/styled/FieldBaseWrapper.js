// @flow
import styled from 'styled-components';

// Display toggle needed to prevent edit click trigger exceeding hover width.
// Max-width required to prevent text overflow when display is inline.
const FieldBaseWrapper = styled.div`
  display: ${({ displayFullWidth }) =>
    displayFullWidth ? 'block' : 'inline-block'};
  max-width: 100%;
  flex-basis: auto;
  flex-grow: 1;
  flex-shrink: 1;
`;

FieldBaseWrapper.displayName = 'FieldBaseWrapper';

export default FieldBaseWrapper;
