/* eslint-disable react/prop-types,react/no-multi-comp */
// @flow
import React, { Component } from 'react';

import asExperiment from '../src/asExperiment';
import ExperimentController from '../src/ExperimentController';

export class Control extends Component<{ title: string }> {
  render() {
    const { title } = this.props;
    const text = `Control ${title}`;
    return <div>{text}</div>;
  }
}

export class VariantA extends Component<{ title: string }> {
  render() {
    const { title } = this.props;
    const text = `Variant A ${title}`;
    return <div>{text}</div>;
  }
}

export class VariantB extends Component<{ title: string }> {
  render() {
    const { title } = this.props;
    const text = `Variant B ${title}`;
    return <div>{text}</div>;
  }
}

// eslint-disable-next-line react/require-render-return
export class Broken extends Component<{}> {
  render() {
    throw new Error('Threw on render');
  }
}

export class Loader extends Component<{}> {
  render() {
    return <div>Loading ...</div>;
  }
}

export const ExperimentWrapped = asExperiment(
  {
    variantA: VariantA,
    variantB: VariantB,
    broken: Broken,
    control: Control,
    fallback: Control,
  },
  'myExperimentKey',
  {
    onError: error => console.log('onError', error.message),
    onExposure: exposureDetails => console.log('onExposure', exposureDetails),
  },
  Loader,
);

const resolveAfterDelay = (resolvesTo, delay = 2000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(resolvesTo);
    }, delay);
  });

const scenarios = [
  {
    name: 'Control cohort and eligible',
    resolvesTo: {
      cohort: 'control',
      isEligible: true,
    },
  },
  {
    name: 'Variant A cohort and eligible',
    resolvesTo: {
      cohort: 'variantA',
      isEligible: true,
    },
  },
  {
    name: 'Variant B cohort and eligible',
    resolvesTo: {
      cohort: 'variantB',
      isEligible: true,
    },
  },
  {
    name: 'Reverts to control when ineligible',
    resolvesTo: {
      cohort: 'variantA',
      isEligible: false,
      ineligibilityReasons: ['because I say so'],
    },
  },
  {
    name: 'Reverts to control for non-defined cohort',
    resolvesTo: {
      cohort: 'nonExistentCohort',
      isEligible: true,
    },
  },
  {
    name: 'Reverts to control when variant component throws at render',
    resolvesTo: {
      cohort: 'broken',
      isEligible: true,
    },
  },
];

export default () => (
  <table style={{ tableLayout: 'fixed', margin: 20 }}>
    <tr>
      <th />
      <th>Sync</th>
      <th>Async (2s delay)</th>
    </tr>

    {scenarios.map(({ name, resolvesTo }) => (
      <tr>
        <td>{name}</td>

        <td>
          <ExperimentController
            experimentEnrollmentConfig={{
              myExperimentKey: () => Promise.resolve(resolvesTo),
            }}
          >
            <ExperimentWrapped title="Component" />
          </ExperimentController>
        </td>

        <td>
          <ExperimentController
            experimentEnrollmentConfig={{
              myExperimentKey: () => resolveAfterDelay(resolvesTo, 2000),
            }}
          >
            <ExperimentWrapped title="Component" />
          </ExperimentController>
        </td>
      </tr>
    ))}
  </table>
);
