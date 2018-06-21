// @flow
import React from 'react';
import isEqual from 'lodash.isequal';
import { code, md } from '@atlaskit/docs';

type InstrumentedItem = {
  packageName: string,
  component: string,
  context: { component: string },
  prop: string,
  payload: Object,
};

const scrubRepeatedInfo = (
  item: InstrumentedItem,
  i: number,
  items: InstrumentedItem[],
) => {
  const prev = i > 0 ? items[i - 1] : {};
  return {
    ...item,
    packageName: item.packageName !== prev.packageName ? item.packageName : '',
    component: item.component !== prev.component ? item.component : '',
    context: !isEqual(item.context, prev.context) ? item.context : undefined,
  };
};

const InstrumentedTable = ({ packages }: { packages: InstrumentedItem[] }) => (
  <table>
    <thead>
      <tr>
        <th>Package</th>
        <th>Component</th>
        <th>Context</th>
        <th>Prop</th>
        <th>Payload</th>
      </tr>
    </thead>
    <tbody>
      {packages
        .map(scrubRepeatedInfo)
        .map(({ packageName, context, component, prop, payload }) => (
          <tr key={packageName}>
            <td>{packageName}</td>
            <td>{component}</td>
            <td>{context ? JSON.stringify(context) : ''}</td>
            <td>{prop}</td>
            <td>{JSON.stringify(payload)}</td>
          </tr>
        ))}
    </tbody>
  </table>
);

export default md`
  ## Usage

  Many of our components support analytics out of the box. These components create
  analytics events and hand them to you. This puts you in control of firing, listening
  and recording these events in which ever way you like.

  Let's look at a simple component to understand how to use Button's click analytics.

  ##### SaveButton.js
${code`
import Button from '@atlaskit/button';

const SaveButton = ({ onClick }) => (
  <Button onClick={onClick}>Save</Button>
);
`}

  Button provides you a [UIAnalyticsEvent](/packages/core/analytics-next/docs/reference#UIAnalyticsEvent) as the last arg
  to the onClick hander. This is the pattern used for all callback props that
  support analytics.

  Now you have the event, it is up to you to fire it.

  ##### SaveButton.js
${code`
import Button from '@atlaskit/button';

const SaveButton = ({ onClick }) => (
  <Button
    onClick={(e, analyticsEvent) => {
      analyticsEvent.fire();
      if (onClick) {
        onClick(e);
      }
    }}
  >
    Save
  </Button>
);
`}

  This is a good opportunity to add more information to the analytics event before firing.

  The next step is to set up a listener which receives the events.

  #### App.js
${code`
import { AnalyticsListener } from '@atlaskit/analytics-next';
import SaveButton from './SaveButton';

const sendAnalytics = analytic => console.log(analytic);

const App = () => (
  <AnalyticsListener onEvent={sendAnalytics}>
    <SaveButton />
  </AnalyticsListener>,
);
`}

  The \`onEvent\` handler will be called every time an analytics event is fired.
  This where you can record the event by sending information to a backend service.

  That's it! Below are some links to handy resources.

  * [More information on UIAnalyticsEvent](/packages/core/analytics-next/docs/reference#UIAnalyticsEvent)
  * [The list of instrumented components](#InstrumentedComponents)
  * [Adding extra information to an analytics event](/packages/core/analytics-next/docs/concepts#adding-more-information-to-an-event)
  * [Analytics component reference](/packages/core/analytics-next/docs/reference)

  <a name="InstrumentedComponents"></a>
  ## Instrumented Components

  This table shows all the component interactions that are instrumented. In addition to what is shown
  in the "Context" column, all components include \`package\` and \`version\` in the context.

  ${(
    <InstrumentedTable
      packages={[
        {
          packageName: '@atlaskit/button',
          component: 'Button',
          context: { component: 'button' },
          prop: 'onClick',
          payload: { action: 'click' },
        },
      ]}
    />
  )}

`;
