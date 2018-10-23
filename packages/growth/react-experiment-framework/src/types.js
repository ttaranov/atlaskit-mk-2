// @flow

export type ExperimentKey = string;

export type EnrollmentDetails = {
  cohort: string,
  isEligible: boolean,
  ineligibilityReasons?: string[],
};

export type ExperimentEnrollmentResolver = () => Promise<EnrollmentDetails>;

export type ExperimentDetails = {
  isEnrollmentDecided: boolean,
  enrollmentResolver: ExperimentEnrollmentResolver,
  enrollmentDetails?: EnrollmentDetails,
};

export type Experiments = {
  [ExperimentKey]: ExperimentDetails,
};

export type ExperimentEnrollmentConfig = {
  [ExperimentKey]: ExperimentEnrollmentResolver,
};

export type ExposureDetails = EnrollmentDetails & {
  experimentKey: ExperimentKey,
};

export type ResolverPromises = {
  [ExperimentKey]: Promise<EnrollmentDetails>,
};
