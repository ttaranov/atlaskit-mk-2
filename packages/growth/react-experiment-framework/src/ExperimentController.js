// @flow

import React, { Component, type Element } from 'react';
import { ExperimentProvider } from './ExperimentContext';
import type {
  ExperimentKey,
  EnrollmentDetails,
  Experiments,
  ExperimentEnrollmentConfig,
  ResolverPromises,
} from './types';

type Props = {
  experimentEnrollmentConfig: ExperimentEnrollmentConfig,
  children?: Element<any>,
};

type State = {
  experiments: Experiments,
};

class ExperimentController extends Component<Props, State> {
  static displayName = 'ExperimentController';

  resolverPromises: ResolverPromises = {};

  constructor(props: Props) {
    super(props);

    const { experimentEnrollmentConfig } = this.props;

    const intialExperiments = Object.keys(experimentEnrollmentConfig).reduce(
      (cumulative: any, experimentKey: ExperimentKey) => ({
        ...cumulative,
        [experimentKey]: {
          isEnrollmentDecided: false,
          enrollmentResolver: () =>
            this.resolverPromises[experimentKey] ||
            this.resolveEnrollmentForExperiment(experimentKey),
        },
      }),
      {},
    );

    this.state = {
      experiments: intialExperiments,
    };
  }

  resolveEnrollmentForExperiment(experimentKey: ExperimentKey) {
    const { experimentEnrollmentConfig } = this.props;

    const enrollmentResolver = experimentEnrollmentConfig[experimentKey];

    // updates context after resolving
    const enrollmentPromise = enrollmentResolver();

    enrollmentPromise.then((enrollmentDetails: EnrollmentDetails) => {
      this.setState({
        experiments: {
          [experimentKey]: {
            isEnrollmentDecided: true,
            enrollmentDetails,
          },
        },
      });
    });

    // cache the resolver promise to avoid resolving enrollment multiple times
    this.resolverPromises[experimentKey] = enrollmentPromise;

    return enrollmentPromise;
  }

  render() {
    const { experiments } = this.state;
    const { children } = this.props;

    return (
      <ExperimentProvider value={experiments}>{children}</ExperimentProvider>
    );
  }
}

export default ExperimentController;
