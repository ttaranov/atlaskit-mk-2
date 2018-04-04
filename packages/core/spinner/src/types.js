// @flow

import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

type SpinnerSizes = 'small' | 'medium' | 'large' | 'xlarge' | number;

export type SpinnerProps = {
  /** Time in milliseconds after component mount before spinner is visible. */
  delay: number,
  /** Set the spinner color to white, for use in dark-themed UIs. */
  invertColor: boolean,
  /** Handler for once the spinner has completed its outro animation. The last argument can be used to track analytics, see [analytics-next](/packages/core/analytics-next) for details. */
  onComplete: (analyticsEvent?: UIAnalyticsEvent) => void,
  /** Size of the spinner. */
  size: SpinnerSizes,
  /** Whether the process is complete and the spinner should leave */
  isCompleting: boolean,
};

export type SpinnerPhases = 'DELAY' | 'ENTER' | 'IDLE' | 'LEAVE' | '';

export type SpinnerState = {
  phase: SpinnerPhases,
};
