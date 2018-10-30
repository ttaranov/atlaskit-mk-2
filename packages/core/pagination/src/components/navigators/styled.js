//@flow
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';

export const PaddedButton = styled(Button)`
  padding: ${({ styles }) =>
    styles && styles.padding
      ? styles.padding
      : `${gridSize() / 2}px ${gridSize() / 2}px 0 ${gridSize() / 2}px`};
`;
