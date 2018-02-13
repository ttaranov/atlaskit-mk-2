// @flow
import React from 'react';
import { code, md, Props } from '@atlaskit/docs';

export default md`
  ## Contents

  * [withAnalyticsEvents](#withAnalyticsEvents)
  * [UIAnalyticsEvent](#UIAnalyticsEvent)
  * [AnalyticsListener](#AnalyticsListener)
  * [AnalyticsContext](#AnalyticsContext)
  * [withAnalyticsContext](#withAnalyticsContext)
  * [AnalyticsEvent](#AnalyticsEvent)

  <a name="withAnalyticsEvents"></a>
  # withAnalyticsEvents

  &nbsp;

  ${code(["import { withAnalyticsEvents } from '@atlaskit/analytics-next';"])}

  A HOC which provides the wrapped component with a method for creating \`UIAnalyticsEvent\`s, via \`props.createAnalyticsEvent\`. Please refer to the tutorial for a thorough explanation of events and how to use them.

  Usage:

  ${code([`withAnalyticsEvents()(Button);`])}

  It accepts an optional map as its first argument, which provides a shortcut for passing a new analytics event as an additional parameter to the corresponding callback prop.

  Here's how that might look:

  ${code([
    `withAnalyticsEvents({
  onChange: (createAnalyticsEvent, props) => {
    return createAnalyticsEvent({ action: 'change', checked: !props.checked });
  }
})(Checkbox);`,
  ])}

  Whenever the wrapped component would fire a prop callback (in this case \`onChange\`), the corresponding function will be run first. It is provided with a function for creating an analytics event, as well as the component's props, and it should return a new analytics event. This event will automatically be added as an additional argument to the prop callback.

  Since creating and returning an event is such a common pattern an even more concise shorthand is supported:

  ${code([
    `withAnalyticsEvents({
  onClick: { action: 'click' }
})(Button)`,
  ])}

  You can simply provide a payload object and an event will be created automatically.

  <a name="UIAnalyticsEvent"></a>
  # UIAnalyticsEvent

  The class of the event created by a component wrapped in \`withAnalyticsEvents\`. It has the following interface:

  &nbsp;

  ${code([
    `/** An array of objects containing data provided by any AnalyticsContext
 * components in the tree above where this event was created. */
context: Array<{}>;

/** An array of functions provided by any AnalyticsListener components in the
 * tree above where this event was created. */
handlers: Array<(event: UIAnalyticsEvent, channel?: string) => void>;

/** An object containing arbitrary data. Can be modified via the .update()
 * method. */
payload: {};

/** Create a new event with the same context, handlers and payload as this
 * event. */
clone(): UIAnalyticsEvent | null;

/** Fire this event on the given channel. Listeners on this channel will be
 * called. */
fire(channel?: string): void;

/** Modify this event's payload. Accepts either a function, which will be passed
 * the current payload and must return a new payload, or an object, which will
 * be shallow merged into the current payload. */
update(updater: {} | (payload: {}) => {}): UIAnalyticsEvent;`,
  ])}

  <a name="AnalyticsListener"></a>
  # AnalyticsListener

  &nbsp;

  ${code(["import { AnalyticsListener } from '@atlaskit/analytics-next';"])}

  An \`AnalyticsListener\` wraps your app and listens to any events which are fired within it.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/AnalyticsListener')}
    />
  )}

  <a name="AnalyticsContext"></a>
  # AnalyticsContext

  &nbsp;

  ${code(["import { AnalyticsContext } from '@atlaskit/analytics-next';"])}

  Wrap part of your tree in \`AnalyticsContext\` to provide data to any events created beneath it. When an event is created it snapshots all of the \`AnalyticsContext\`s above it in the tree and creates an array from the data. It's up to you to parse this information when you handle the event.

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/AnalyticsContext')}
    />
  )}

  <a name="withAnalyticsContext"></a>
  # withAnalyticsContext

  &nbsp;

  ${code(["import { withAnalyticsContext } from '@atlaskit/analytics-next';"])}

  This HOC wraps a component in an \`AnalyticsContext\` and allows you to provide a default \`data\` value for it.

  Usage:

  ${code([
    `const ButtonWithContext = withAnalyticsContext({
  // Default context data
  component: 'button',
})(Button);

/* ... */

const Form = (props) => (
  <div>
    <Field />
    <ButtonWith Context
      // The consumer can overwrite the default context data
      analyticsContext={{ component: 'submit-button' }}
      {...props}
    >
      Submit
    </ButtonWithContext>
  </div>
);`,
  ])}

  Note: if a consumer provides a value for \`analyticsContext\` it is shallow merged with the default data.

  <a name="AnalyticsEvent"></a>
  # AnalyticsEvent

  &nbsp;

  ${code(["import { AnalyticsEvent } from '@atlaskit/analytics-next';"])}

  A more generic type of event which only contains a payload and an update method. If you want to create an event outside of the UI you can create an instance of this class directly. Please see [UIAnalyticsEvent](#UIAnalyticsEvent) for more information.
`;
