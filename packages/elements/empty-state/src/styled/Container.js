// @flow

import styled from 'styled-components';
import { akGridSizeUnitless } from '@atlaskit/util-shared-styles';

const verticalMarginSize = akGridSizeUnitless * 6;
const wideContainerWidth = akGridSizeUnitless * 58; // (based on 6 columns and 5 gutters in the 'medium' grid)
const narrowContainerWidth = akGridSizeUnitless * 38; // (based on 4 columns and 3 gutters in the 'medium' grid)

const Container = styled.div`
  margin: ${verticalMarginSize}px auto;
  text-align: center;
  width: ${props =>
    props.size === 'narrow' ? narrowContainerWidth : wideContainerWidth}px;
`;

export default Container;
