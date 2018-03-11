// @flow
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';

const Trigger = styled.div`
  align-items: center;
  display: flex;
  min-height: ${math.multiply(gridSize, 4.5)}px;
  outline: none;
  width: 100%;
`;

Trigger.displayName = 'SingleSelectTrigger';

export default Trigger;
