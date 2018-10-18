// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage appearance="warning">
      <p>
        <strong>
          Note: @atlaskit/react-experiment-framework is currently in developer
          preview.
        </strong>
      </p>
      <p>
        Please experiment with and test this package but be aware that the API
        may & probably will change with future releases.
      </p>
    </SectionMessage>
  )}

  The React experiment framework is a set of React component that facilitate easier product experimentation.

  It provides a way of swapping React components at run-time, e.g., switching a control component for your new
  variant component.

  Each targeted react component is wrapped in an ExperimentSwitch component, that toggles which component will render
  based on context passed down from an ExperimentController component.

  The ExperimentController is passed a configuration object - an map of experimentKey: string to enrollmentResolver: () => Promise\\\<EnrollmentDetails\\\>.
  This resolver based approach allows the rendering of targeted components to be blocked until the resolver, an async method is completed, and the
  appropriate experience is only then shown to the user; thus preventing a swapping of experience. A loading component can be provided, to show while the enrollment is being processed.

  In some cases the enrollmentResolver will just be a sync call to featureFlag client, to lookup the cohort that a given user is in. However, sometimes it might be required to
  additionally do REST calls, or other adhoc checks to see whether your user should get an experience, e.g., a message that should only show once to a customer could require
   a feature flag check plus a check to a store service to lookup whether or not the user has seen that message previously. In the case that async is not needed, just return a resolved
   promise with the enrollment details.

  In addition to returning the cohort in the enrollment details, there is an isEligible property. A user may have been randomly assigned to the variation, but not be eligible to see the experience.
  E.g., eligiblilty might require the user to have a locale where English is the dominant language. In these cases where isEligible is set to false,  the user is shown the fallback experience, i.e., the control component.

  In terms of tracking the success and failures of the experiment; the framework provides callbacks for onExposure (when an experience is shown), and onError (when an error was encountered due to misconfiguration or the component provided threw at render)

  ${(
    <Example
      packageName="@atlaskit/growth"
      Component={require('../examples/00-basic-usage').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}
`;
