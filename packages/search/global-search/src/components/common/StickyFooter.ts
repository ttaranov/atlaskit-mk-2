import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

export default styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid ${colors.N40};
  padding: ${gridSize()}px 0;
`;
