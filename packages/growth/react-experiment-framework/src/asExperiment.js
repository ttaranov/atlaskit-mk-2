// @flow

import React, { Component, type ComponentType, Fragment } from 'react';

import CohortTracker from './CohortTracker';
import { ExperimentConsumer } from './ExperimentContext';
import type { Experiments, ExposureDetails } from './types';

type State = {
  forceFallback: boolean,
};

type ExperimentComponentMap = {
  fallback: ComponentType<any>,
  [string]: ComponentType<any>,
};

export default function asExperiment(
  experimentComponentMap: ExperimentComponentMap,
  experimentKey: string,
  callbacks: {
    onError: (error: Error) => void,
    onExposure: (exposureDetails: ExposureDetails) => void,
  },
  LoadingComponent?: ?ComponentType<any>,
) {
  return class ExperimentSwitch extends Component<{}, State> {
    static displayName = 'ExperimentSwitch';

    state = {
      forceFallback: false,
    };

    onReceiveContext = (context: Experiments) => {
      const { forceFallback } = this.state;
      const { onExposure } = callbacks;

      if (forceFallback) {
        return this.renderFallback();
      }

      if (!(experimentKey in context)) {
        throw new Error(
          `Experiment Key ${experimentKey} does not exist in configuration`,
        );
      }

      const experimentDetails = context[experimentKey];
      if (!experimentDetails.isEnrollmentDecided) {
        // kick off the async check of the resolver
        experimentDetails.enrollmentResolver();

        // still waiting on whether or not to show an experiment
        if (LoadingComponent) {
          return <LoadingComponent />;
        }
        return null;
      }

      const { enrollmentDetails } = experimentDetails;
      if (!enrollmentDetails) {
        throw new Error(
          `Experiment ${experimentKey} has missing enrollment details`,
        );
      }

      const { cohort, isEligible, ineligibilityReasons } = enrollmentDetails;

      if (!(cohort in experimentComponentMap)) {
        throw new Error(
          `Cohort ${cohort} does not exist for experiment ${experimentKey}`,
        );
      }

      const View = isEligible
        ? experimentComponentMap[cohort]
        : experimentComponentMap.fallback;

      const exposureDetails: ExposureDetails = {
        experimentKey,
        cohort,
        isEligible,
        ineligibilityReasons,
      };

      return (
        <Fragment>
          <View {...this.props} key="experimentView" />
          <CohortTracker
            exposureDetails={exposureDetails}
            onExposure={onExposure}
            key="cohortTracker"
          />
        </Fragment>
      );
    };

    componentDidCatch(err: Error) {
      const { onError } = callbacks;

      onError(err);

      this.setState({
        forceFallback: true,
      });
    }

    renderFallback = () => {
      const FallbackView = experimentComponentMap.fallback;
      return <FallbackView {...this.props} />;
    };

    render() {
      return (
        <ExperimentConsumer>
          {context => this.onReceiveContext(context)}
        </ExperimentConsumer>
      );
    }
  };
}
