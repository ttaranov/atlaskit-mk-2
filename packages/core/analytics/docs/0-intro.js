// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  The analytics package exports several components and functions that work together
  to enable other components to fire analytics, extend event data, and process events.

**Usage**:

${code`
import {
  AnalyticsDecorator,
  AnalyticsListener,
  cleanProps,
  withAnalytics
} from '@atlaskit/analytics';
`}

  Using this library components can fire public and private events:

  * Public events should be used by component consumers to track how customers are
    using their application.
  * Private events should be used by component authors to monitor how customers are
    using their components.

  Components that want to fire private events and support public events for consumers
  will need to be wrapped using the \`withAnalytics\` higher-order component.
  This will provide the wrapped component with several props that should be filtered
  out using the \`cleanProps\` function before passing to any children.

  As a general guideline component authors should follow the 'Integrating Components'
  example to add both public and private events. For these components consumers should
  only need to set the \`analyticsId\` for public events to fire. If a consumer finds
  a component that does not have analytics they can call \`fireAnalyticsEvent\` in
  their component or look at the 'Wrapping Components' example.

  If your component needs to always fire public events then you can set a default
  \`analyticsId\`, see the 'Setting Default Analytics Props' example. Please be aware
  that consumers can still override this default.

  \`AnalyticsDecorator\` can be used to extend the event data of child components. It
  can be configured to only intercept certain events based on event name and/or type
  (public or private). Decorators can also be nested within one another enabling
  different combinations of filtering and extending. With this events will continue
  to bubble up to the next decorator in the hierarchy.

  \`AnalyticsListener\` is used to capture child events for processing (e.g. sending to a
  web service). Similarly to \`AnalyticsDecorator\` it has options for filtering (event
  name and type) and can be nested within other listeners.

  If you are using a state manager like Redux and need to fire events in the stores with the
  decorated analyticsData then you can use \`getParentAnalyticsData(analyticsId)\`. This
  function will traverse the hierarchy for \`AnalyticsDecorators\` and build the extended
  analyticsData that would have been generated based on all the filtering logic. This
  parentAnalyticsData can then be passed to the stores as a property on the action.

  Open up the browser console to see the analytic events in the examples.

  ${(
    <Example
      packageName="@atlaskit/analytics"
      Component={require('../examples/01-basic-example').default}
      title="Basic usage"
      source={require('!!raw-loader!../examples/01-basic-example')}
    />
  )}

  ${(
    <Props
      heading="AnalyticsDecorator Props"
      props={require('!!extract-react-types-loader!../src/AnalyticsDecorator')}
    />
  )}

  ${(
    <Props
      heading="AnalyticsListener Props"
      props={require('!!extract-react-types-loader!../src/AnalyticsListener')}
    />
  )}
`;
