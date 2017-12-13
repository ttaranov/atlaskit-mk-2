// @flow

import { colors, gridSize, fontSize } from '@atlaskit/theme';
import styled from 'styled-components';
import { spacing } from '../constants';

const halfGridSize = gridSize() / 2;
const progressBarHeight = gridSize();
const labelTopSpacing = gridSize() + 20; // Labels sit 20px from bottom of progress bar.

export const ProgressTrackerStageContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const ProgressTrackerStageMarker = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, -${labelTopSpacing}px);
  background-color: ${props => props.color};
  height: ${progressBarHeight}px;
  width: ${progressBarHeight}px;
  border-radius: ${progressBarHeight}px;
`;

export const ProgressTrackerStageBar = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(0, -${labelTopSpacing}px);
  background-color: ${colors.B300};
  height: ${progressBarHeight}px;
  width: calc(
    ${props => props.percentageComplete}% + ${props => props.percentageComplete}/100*${props =>
        halfGridSize + spacing[props.theme.spacing]}px
  ); /* account for spacing and radius of marker */
  border-top-right-radius: ${gridSize}px;
  border-bottom-right-radius: ${gridSize}px;
`;

export const ProgressTrackerStageTitle = styled.div`
  font-weight: ${props => props.fontweight};
  line-height: 16px;
  color: ${props => props.color};
  text-align: center;
  font-size: ${fontSize}px;
  margin-left: auto;
  margin-right: auto;
  margin-top: ${labelTopSpacing}px;
`;
