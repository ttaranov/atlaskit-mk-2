// @flow
import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

const FooterDiv = styled.div`
  padding: ${gridSize()}px 0 ${gridSize() / 2}px 0;
  border-top: ${({ shouldHideSeparator }) =>
    shouldHideSeparator ? '0' : `2px solid ${colors.N40A}`};
`;

export default FooterDiv;
