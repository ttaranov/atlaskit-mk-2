// @flow
import React from 'react';
import { code, Example, md } from '@atlaskit/docs';

export default md`
  ### Contents

  * [Creating an analytics event](#creating-an-analytics-event)
  * [Firing an event](#firing-an-event)
  * [Adding context to an event](#adding-context-to-an-event)
  * [Passing an event to your consumers](#passing-an-event-to-your-consumers)
  * [Adding data to an event's payload](#adding-data-to-an-events-payload)
  * [Cloning an event](#cloning-an-event)
  * [Asynchronous firing](#asynchronous-firing)
  * [Tracking events outside the UI](#tracking-events-outside-the-ui)

  <a name="creating-an-analytics-event"></a>
  ## Creating an analytics event

  The \`withAnalyticsEvents\` HOC provides the wrapped component with a function for creating analytics events. This function takes an optional \`payload\` argument.

  **Important:** The payload object must contain an \`action\` property. Use this field to capture the initial user interaction which triggered the event.

  Creating an event is as simple as this:

  ##### Button.js

${code`
import React, { Component } from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

class Button extends Component {
  handleClick = e => {
    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent({ action: 'click' });

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

export default withAnalyticsEvents()(Button);
`}

  <a name="firing-an-event"></a>
  ## Firing an event

  We've got an analytics event, but now we need to do something with it. If we simply want to track every time somebody clicks our button we can fire the event right away:

  ##### Button.js (handleClick method)

${code`
handleClick = e => {
  // Create our analytics event
  const analyticsEvent = this.props.createAnalyticsEvent({ action: 'click' });

  // Fire our analytics event on the 'atlaskit' channel
  analyticsEvent.fire('atlaskit');

  if (this.props.onClick) {
    this.props.onClick(e);
  }
};
`}

  We fire events on a specific \`channel\`; in this case it's the \`'atlaskit'\` channel. If we're going to fire an event we'll also need something to handle it. Here's our app:

  ##### App.js

${code`
import React, { Component } from 'react';
import { render } from 'react-dom';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Button from './Button';

class App extends Component {
  handleEvent = analyticsEvent => {
    console.log(analyticsEvent);
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <Button>Click me</Button>
      </AnalyticsListener>
    );
  }
}

render(<App />, document.getElementById('root'));
`}

  The \`AnalyticsListener\` component accepts \`channel\` and \`onEvent\` props. When an event is fired on this Listener's channel its onEvent function will be called.

  💥 Boom, you've just instrumented a component with analytics! Here it is in action:

  ${(
    <Example
      Component={require('../examples/10-basic-create-and-fire').default}
      title="Creating and firing an event"
      source={require('!!raw-loader!../examples/10-basic-create-and-fire')}
    />
  )}

  <a name="adding-context-to-an-event"></a>
  ## Adding context to an event

  What if this button lives inside a Jira issue, and we want to capture that issue's ID in our analytics event? Our button is a reusable component and doesn't have any idea where or how it's being used. There might also be a number of component boundaries between the part of the app that knows the issue ID and the part of the app that renders the button.

  This is where the \`AnalyticsContext\` component comes in:

  ##### App.js

${code`
import React, { Component } from 'react';
import { render } from 'react-dom';
import {
  AnalyticsContext,
  AnalyticsListener,
} from '@atlaskit/analytics-next';
import Button from './Button';

class App extends Component {
  handleEvent = analyticsEvent => {
    console.log(analyticsEvent);
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        // We wrap part of our tree with an AnalyticsContext
        <AnalyticsContext data={{ issueId: 123 }}>
          <Button>Click me</Button>
        </AnalyticsContext>
      </AnalyticsListener>
    );
  }
}

render(<App />, document.getElementById('root'));
`}

  You can add multiple layers of \`AnalyticsContext\`s throughout your render tree. Context is stored in the analytics event as an array of objects and it's up to you to merge or transform this data when you handle the event.

  ${(
    <Example
      Component={require('../examples/20-adding-analytics-context').default}
      title="Adding context to an event"
      source={require('!!raw-loader!../examples/20-adding-analytics-context')}
    />
  )}

  <a name="passing-an-event-to-your-consumers"></a>
  ## Passing an event to your consumers

  Sometimes you don't want to fire an event as soon as it's created - you want to provide it to whoever is using your component so they can fire it when they're ready and track their own analytics.

  This can be done with plain old Javascript! Just pass it as an extra argument to the corresponding callback prop. Here's our updated Button component:

  ##### Button.js (handleClick method)

${code`
handleClick = e => {
  // Create our analytics event
  const analyticsEvent = this.props.createAnalyticsEvent({ action: 'click' });

  if (this.props.onClick) {
    // Pass the event through the corresponding callback prop
    this.props.onClick(e, analyticsEvent);
  }
};
`}

  This is a pretty common pattern for component authors, so \`withAnalyticsEvents\` includes a shortcut:

  ##### Button.js

${code`
import React, { Component } from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

class Button extends Component {
  /** We don't need to manually create the event and pass it to the callback
  prop any more, so we can remove the handleClick method */

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} />;
  }
}

export default withAnalyticsEvents({
  /** Whenever we would fire our onClick prop this function is run first. It
  should return a new analytics event, which will automatically be added as a
  final argument to the onClick prop callback. */
  onClick: createEvent => {
    return createEvent({ action: 'click' });
  },
})(Button);
`}

  \`withAnalyticsEvents\` accepts an optional object mapping callback prop names to functions. These functions will be passed the \`createAnalyticsEvent\` method and the instance's props, and should return an analytics event. This event will be automatically added as a final argument to the callback prop.

  Since creating and returning an event is such a common pattern we've included an even quicker shorthand:

${code`
withAnalyticsEvents({
  // If you simply provide a payload we'll automatically create an event for you
  onClick: { action: 'click' }
})(Button);
`}

  ${(
    <Example
      Component={require('../examples/30-passing-events-to-a-callback').default}
      title="Passing events through callbacks"
      source={require('!!raw-loader!../examples/30-passing-events-to-a-callback')}
    />
  )}

  <a name="adding-data-to-an-events-payload"></a>
  ## Adding data to an event's payload

  As your event is passed up the tree through callback props you might want to add data to it along the way. Here's an example of how that might look:

  ${(
    <Example
      Component={require('../examples/40-updating-an-event').default}
      title="Adding data to an event"
      source={require('!!raw-loader!../examples/40-updating-an-event')}
    />
  )}

  What's happening here is that a keydown event in an input field and a click event in a button are both triggering a submit event in a form, which adds the value of the field to the event before firing it.

  Analytics events have an \`.update\` method. This accepts a function which is called with the event's current payload and should return a new payload. For convenience \`.update\` also accepts an object which is automatically shallow merged into its current payload.

  You'll also notice that we've introduced another feature - \`withAnalyticsContext\`. This HOC wraps your component in an \`AnalyticsContext\` and allows you to provide a default value for the context data.

  In this example we're using analytics context to capture the component hierarchy where this event came from. The Input and Button components have been wrapped in \`withAnalyticsContext\` by their author, and a default \`component\` property has been provided (\`'text-field'\` and \`'button'\` respectively). The developer who is composing the Form has wrapped their component in an AnalyticsContext to provide another layer of context (\`{ component: 'form' }\`). They have also overwritten the Button's default context to provide a more specific \`component\` value (\`'submit-button'\`) - imagine this form also contained a 'Cancel' button for instance. When an event is created it now contains a trace of the component tree above it, allowing us to drill down to the specific user interaction (a button click) which triggered an action (a form being submitted).

  **Important:** All Atlaskit components will add a \`component\` value to their analytics context where applicable. Other Atlassian teams are encouraged to follow this convention and standardise on the use of \`'component'\` as the key for storing this information in context.

  <a name="cloning-an-event"></a>
  ## Cloning an event

  There's one final thing you need to know - once an event has been fired it cannot be updated or fired again.

  This poses a problem for library component authors. They might want to catch events from their children and fire their own analytics, while also exposing analytics events to their consumers. That's where \`.clone\` comes in.

  Take our Form component from the previous example. If it accepted an \`onSubmit\` callback prop we could do something like this:

  ##### Form.js (onSubmit method):

${code`
onSubmit = analyticsEvent => {
  const { value } = this.state;

  // Clone the analytics event
  const publicEvent = analyticsEvent.clone();

  // Add whatever data we want to know about to our event and fire it
  analyticsEvent.update({ value }).fire('atlaskit');

  if (this.props.onSubmit) {
    // Pass the cloned event to the callback prop for consumers to use
    this.props.onSubmit(value, publicEvent);
  }
};
`}

  ${(
    <Example
      Component={require('../examples/50-cloning-an-event').default}
      title="Cloning an event"
      source={require('!!raw-loader!../examples/50-cloning-an-event')}
    />
  )}

  <a name="asynchronous-firing"></a>
  ## Asynchronous firing

  As soon as an event is created it snapshots all of the listeners and context above it in the tree. This means that once you've created an event you can send it wherever you want and wait for as long as you please before firing it. It's even possible to completely unmount the AnalyticsListeners, AnalyticsContexts, and the component that created it!

  ${(
    <Example
      Component={require('../examples/60-async-firing').default}
      title="Asynchronously firing an event"
      source={require('!!raw-loader!../examples/60-async-firing')}
    />
  )}

  <a name="tracking-events-outside-the-ui"></a>
  ## Tracking events outside the UI

  This library provides tools for tracking interactions with UI components, and makes it really easy to capture the UI context and state when these events occur. But what if the event you're tracking doesn't care about the UI? Can you still use this library to track it?

  Well, sure - but you might not need to. An event has to be created by a UI component to get \`context\` and a \`.fire\` method. Without these properties an analytics event is basically a payload! It might be simpler to just create an object and pass it directly to the function that handles your events.

  In case it is useful for you to have a consistent interface for your events, even if they're not coming from the UI, we do export the base \`AnalyticsEvent\` class. Here's an example of how you might use it:

${code`
import { AnalyticsEvent } from '@atlaskit/analytics-next';
import sendAnalyticsEventToBackend from './sendAnalyticsEventToBackend';

const fetchBacon = async () => {
  const startTime = performance.now();

  const data = (await (await fetch(
    'https://baconipsum.com/api/?type=meat-and-filler',
  )).json())[0];

  const responseTime = performance.now() - startTime;

  /** This event records server response time. This function doesn't live inside
   * a component and we don't care what state the UI is in when it runs. It
   * would be annoying if we had to create the event inside a component, then
   * pass it to this function. We can create a generic AnalyticsEvent and handle
   * it all inside this function instead. */
  const analyticsEvent = new AnalyticsEvent({
    payload: { action: 'server-request', data, responseTime },
  });

  /** Because we're not in the UI this event doesn't have any
   * AnalyticsListeners, which means it doesn't have a .fire method. We need to
   * explicitly pass it to the function that will handle it. */
  sendAnalyticsEventToBackend(analyticsEvent);

  return data;
};
`}
`;
