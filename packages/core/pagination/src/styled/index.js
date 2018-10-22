// @flow
import styled from 'styled-components';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';

export const Container = styled.div`
  display: flex;
`;

export const Ellipsis = styled.span`
  display: flex;
  padding: 0 ${gridSize() * 2}px;
  text-align: center;
  align-items: center;
`;

/**
 * We need this to style the button with Icon, else it is not properly vertically aligned
 * with rest of the buttons
 */
export const StyledButton = styled(Button)`
  padding: ${gridSize() / 2}px ${gridSize() / 2}px 0 ${gridSize() / 2}px;
`;
