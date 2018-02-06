// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ### Creating an analytics event

  The \`withCreateAnalyticsEvent\` HOC provides the wrapped component with a function for creating analytics events. It's as simple as this:

  ##### Button.js

  ~~~javascript
  import React, { Component } from 'react';
  import { withCreateAnalyticsEvent } from '@atlaskit/analytics';

  class Button extends Component {
    handleClick = e => {
      // Create our analytics event
      const analyticsEvent = this.props.createAnalyticsEvent('click');

      if (this.props.onClick) {
        this.props.onClick(e);
      }
    };

    render() {
      const { createAnalyticsEvent, ...props } = this.props;
      return <button {...props} onClick={this.handleClick} />;
    }
  }

  export default withCreateAnalyticsEvent()(Button);
  ~~~

  ### Firing an event

  We've got an analytics event, but now we need to do something with it. If we simply want to track every time somebody clicks our button we can fire the event right away:

  ##### Button.js (handleClick method)

  ~~~javascript
  handleClick = e => {
    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent('click');

    // Fire our analytics event on the 'atlaskit' channel
    analyticsEvent.fire('atlaskit');

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };
  ~~~

  We fire events on a specific \`channel\`; in this case it's the 'atlaskit' channel. If we're going to fire an event we'll also need something to handle it. Here's our app:

  ##### App.js

  ~~~javascript
  import React, { Component } from 'react';
  import { render } from 'react-dom';
  import { AnalyticsListener } from '@atlaskit/analytics';
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
  ~~~

  The \`AnalyticsListener\` component accepts \`channel\` and \`onEvent\` props. When an event is fired on this Listener's channel its onEvent function will be called.

  💥 Boom, you've just instrumented a component with analytics! Here it is in action:

  ${(
    <Example
      Component={require('../examples/100-tutorial-basic').default}
      title="Creating and firing an event"
      source={require('!!raw-loader!../examples/100-tutorial-basic')}
    />
  )}

  ### Adding context to an event

  What if this button lives inside a Jira issue, and we want to capture that issue's ID in our analytics event? Our button is a reusable component and doesn't have any idea where or how it's being used. There might also be a number of component boundaries between the part of the app that knows the issue ID and the part of the app that renders the button.
  
  This is where the \`AnalyticsContext\` component comes in:

  ##### App.js

  ~~~javascript
  import React, { Component } from 'react';
  import { render } from 'react-dom';
  import {
    AnalyticsContext,
    AnalyticsListener,
  } from '@atlaskit/analytics';
  import Button from './Button';

  class App extends Component {
    handleEvent = analyticsEvent => {
      console.log(analyticsEvent);
    };

    render() {
      return (
        <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
          <AnalyticsContext data={{ issueId: 123 }}>
            <Button>Click me</Button>
          </AnalyticsContext>
        </AnalyticsListener>
      );
    }
  }

  render(<App />, document.getElementById('root'));
  ~~~

  ${(
    <Example
      Component={require('../examples/110-tutorial-context').default}
      title="Adding context to an event"
      source={require('!!raw-loader!../examples/110-tutorial-context')}
    />
  )}

  You can add multiple layers of \`AnalyticsContext\`s throughout your render tree. Context is stored in the analytics event as an array of objects and it's up to you to merge or transform this data when you handle the event.

  ### Passing an event to your consumers

  Sometimes you don't want to fire an event as soon as it's created - you want to provide it to whoever is using your component so they can fire it when they're ready.

  This can be done with plain old Javascript! Just pass it as an extra argument to the corresponding callback prop. Here's our updated Button component:

  ##### Button.js (handleClick method)

  ~~~javascript
  handleClick = e => {
    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent('click');

    if (this.props.onClick) {
      // Pass the event through the corresponding callback prop
      this.props.onClick(e, analyticsEvent);
    }
  };
  ~~~

  This is a pretty common pattern for component authors, so \`withCreateAnalyticsEvent\` includes a shortcut:

  ##### Button.js

  ~~~javascript
  import React, { Component } from 'react';
  import { withCreateAnalyticsEvent } from '@atlaskit/analytics';

  class Button extends Component {
    render() {
      const { createAnalyticsEvent, ...props } = this.props;
      return <button {...props} />;
    }
  }

  export default withCreateAnalyticsEvent({
    onClick: createEvent => {
      return createEvent('click');
    },
  })(Button);
  ~~~

  \`withCreateAnalyticsEvent\` accepts an optional object mapping callback prop names to functions. These functions will be passed the \`createAnalyticsEvent\` method and the instance's props, and should return an analytics event. This event will be automatically added as a final argument to the prop callback.

  There's an even quicker shorthand for creating and returning an event:

  ~~~javascript
  export default withCreateAnalyticsEvent({ onClick: 'click' })(Button);
  ~~~

  ${(
    <Example
      Component={
        require('../examples/120-tutorial-pass-event-to-callback').default
      }
      title="Passing events through callbacks"
      source={require('!!raw-loader!../examples/120-tutorial-pass-event-to-callback')}
    />
  )}

  ### Adding data to an event

  As your event is passed up the tree through callback props you might want to add data to it along the way. Here's an example of how that might look:

  ${(
    <Example
      Component={require('../examples/130-tutorial-updating').default}
      title="Adding data to an event"
      source={require('!!raw-loader!../examples/130-tutorial-updating')}
    />
  )}

  What's happening here is that a keydown event in an input field and a click event in a button are both triggering a submit event in a form, which adds the value of the field to the event before firing it.
  
  Analytics events have an \`.update\` method. This accepts a function which is called with the event's current payload and should return a new payload. For convenience \`.update\` also accepts an object which is automatically shallow merged into its current payload.

  You'll also notice that we've introduced another feature - \`withAnalyticsContext\`. This HOC wraps your component in an \`AnalyticsContext\` and allows you to provide a default value for the context data. We're using analytics context here to capture whether the form submission was originally triggered from a \`keydown\` in the input field or a \`click\` on the button.

  ### Cloning an event

  There's one final thing you need to know - once an event has been fired it cannot be updated or fired again.

  This poses a problem for library component authors. They might want to catch events from their children and fire their own analytics, while also exposing analytics events to their consumers. That's where \`.clone\` comes in.

  Take our Form component from the previous example. If it accepted an \`onSubmit\` callback prop we could do something like this:

  ##### Form.js (onSubmit method):

  ~~~javascript
  onSubmit = analyticsEvent => {
    const { value } = this.state;

    // Clone the analytics event
    const publicEvent = analyticsEvent.clone();

    // Add whatever data we want to know about to our event and fire it
    analyticsEvent.update({ value }).fire('atlaskit');

    // Pass the cloned event to the callback prop for consumers to use
    this.props.onSubmit(value, publicEvent);
  };
  ~~~

  ### Tracking events outside the UI
`;
