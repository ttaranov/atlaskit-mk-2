// @flow

import { Component } from 'react';
import type { ExposureDetails } from './types';

type Props = {
  exposureDetails: ExposureDetails,
  onExposure: (exposureDetails: ExposureDetails) => void,
};

export default class CohortTracker extends Component<Props> {
  static displayName = 'CohortTracker';

  componentDidMount() {
    const { exposureDetails, onExposure } = this.props;
    onExposure(exposureDetails);
  }

  render() {
    return null;
  }
}
