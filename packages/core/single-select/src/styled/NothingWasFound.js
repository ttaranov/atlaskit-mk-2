// @flow
import styled from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';

const NothingWasFoundElement = styled.div`
  padding: 6px ${math.multiply(gridSize, 3)}px;
`;

NothingWasFoundElement.displayName = 'NothingWasFoundElement';

export default NothingWasFoundElement;
