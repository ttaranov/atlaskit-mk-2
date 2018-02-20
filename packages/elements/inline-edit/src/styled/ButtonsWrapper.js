// @flow
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

const ButtonsWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  margin-top: ${gridSize() * 0.75}px;
  position: absolute;
  right: 0;
  top: 100%;
`;

ButtonsWrapper.displayName = 'ButtonsWrapper';

export default ButtonsWrapper;
