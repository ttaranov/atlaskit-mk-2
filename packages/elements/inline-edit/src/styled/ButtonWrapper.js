// @flow
import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

const gridSizeUnitless = gridSize();

const ButtonWrapper = styled.div`
  background-color: ${colors.N0};
  border-radius: ${gridSizeUnitless / 2 - 1}px;
  box-shadow: 0 ${gridSizeUnitless / 2}px ${gridSizeUnitless}px -${gridSizeUnitless /
        4}px ${colors.N50A},
    0 0 1px ${colors.N60A};
  box-sizing: border-box;
  width: ${gridSizeUnitless * 4}px;
  z-index: 200;

  &:last-child {
    margin-left: ${gridSizeUnitless / 2}px;
  }
`;

ButtonWrapper.displayName = 'ButtonWrapper';

export default ButtonWrapper;
