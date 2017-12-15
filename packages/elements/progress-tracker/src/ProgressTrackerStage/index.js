// @flow

import React, { PureComponent } from 'react';
import { colors } from '@atlaskit/theme';
import { GridColumn } from '@atlaskit/page';
import {
  ProgressTrackerStageContainer,
  ProgressTrackerStageMarker,
  ProgressTrackerStageBar,
  ProgressTrackerStageTitle,
} from './styled';
import type { Stage, ProgressTrackerStageRenderProp } from '../types';

const semibold = '600';
const regular = '400';
const getMarkerColor = status => {
  switch (status) {
    case 'unvisited':
      return colors.N70;
    case 'current':
      return colors.B300;
    case 'visited':
      return colors.B300;
    case 'disabled':
      return colors.B300;
    default:
      return null;
  }
};

const getTextColor = status => {
  switch (status) {
    case 'unvisited':
      return colors.N300;
    case 'current':
      return colors.B300;
    case 'visited':
      return colors.N800;
    case 'disabled':
      return colors.N70;
    default:
      return null;
  }
};

const getFontWeight = status => {
  switch (status) {
    case 'unvisited':
      return regular;
    case 'current':
      return semibold;
    case 'visited':
      return semibold;
    case 'disabled':
      return semibold;
    default:
      return null;
  }
};

type Props = {
  /** stage data passed to each `ProgressTrackerStage` component */
  item: Stage,
  /** render prop to specify how to render components */
  render: ProgressTrackerStageRenderProp,
};

export default class ProgressTrackerStage extends PureComponent<Props> {
  shouldShowLink() {
    return this.props.item.status === 'visited' && !this.props.item.noLink;
  }

  render() {
    const { item, render } = this.props;

    return (
      <GridColumn medium={2}>
        <ProgressTrackerStageContainer>
          <ProgressTrackerStageMarker color={getMarkerColor(item.status)} />
          <ProgressTrackerStageBar
            percentageComplete={item.percentageComplete}
          />
          <ProgressTrackerStageTitle
            color={getTextColor(item.status)}
            fontweight={getFontWeight(item.status)}
          >
            {this.shouldShowLink() ? render.link({ item }) : item.label}
          </ProgressTrackerStageTitle>
        </ProgressTrackerStageContainer>
      </GridColumn>
    );
  }
}
