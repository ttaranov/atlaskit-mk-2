// @flow
import { code, md } from '@atlaskit/docs';

export default md`
We have started wrapping our components with analytics events.

## Why

We have done this for a couple of reasons:

1. It enables you to easily start using our analytics-next package to instrument analytics within your application,
   preventing the need to wrap all Atlaskit components with analytics yourself.
2. It allows us to instrument our own internal analytics within our components for us to get insights on how they
   are being used in the wild.

**Note:** Our internal analytics events are not captured by default, they will only be captured if you have instrumented
a custom Atlaskit \`AnalyticsListener\` that we have provided to you to help us capture our own analytics.

## How

We wrap the component with the \`withAnalyticsEvents\` higher-order component and create a \`UIAnalyticsEvent\` for each
prop callback that is passed in as the last argument.

You can use this event as you see fit, by either updating its payload,
firing it straight away, cloning it (if you want to fire multiple events for the same user interaction) or passing it up to a parent
component that has more context as to what the event means by passing via prop callbacks once more.

Remember, the analytics event is now just a javascript class instance at this stage, you can do what you want with it, including just ignoring it
completely if you do not wish to instrument analytics.

### Payload

The payload we provide is a simple \`action\` property detailing what happened. By convention, this will be the name of the prop callback without the 'on' prefix.

E.g. Our default @atlaskit/button export:

${code`
export default withAnalyticsEvents({
  onClick: { action: 'click' },
})(Button),
`}

### Context

We also provide the atlaskit component name and version via \`AnalyticsContext\` so you can use it as you see fit in the \`AnalyticsListener\` event handler.

E.g. Our default @atlaskit/button export:

${code`
import { name, version } from '../../package.json';

export default withAnalyticsContext({
  component: name,
  version,
})(withAnalyticsEvents(...)(Button))
`}

This will result in something like the following inside the context of the event:

${code`
{ component: '@atlaskit/button', version: '6.4.2' }
`}

### Internal Atlaskit events

We also create and fire our own internal events on the \`atlaskit\` channel. These events are designed to be used for our own analysis on how/where our components are used.
These aren't captured unless your app uses a custom Atlaskit \`AnalyticsListener\` on the 'atlaskit' channel that we can provide you.

E.g. Our default @atlaskit/button export:

${code`
withAnalyticsEvents({
  onClick: createAnalyticsEvent => {
    const consumerEvent = createAnalyticsEvent({
      action: 'click',
    });
    consumerEvent.clone().fire('atlaskit');

    return consumerEvent;
  },
})(Button),
`}

## Instrumented Components

Here is a list of components that are currently instrumented with analytics. Most, if not all, of their prop callback functions should have analytics events.
You can see if it provides an analytics event by its function type.

* Button
  * onClick: \`{ action: 'click' }\`
`;
