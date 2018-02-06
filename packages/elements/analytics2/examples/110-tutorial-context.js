// @flow
import React, { Component } from 'react';
import {
  AnalyticsContext,
  AnalyticsListener,
  UIAnalyticsEvent,
  withCreateAnalyticsEvent,
} from '../src';

class ButtonBase extends Component<*> {
  handleClick = e => {
    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent('click');

    // Fire our analytics event on the 'atlaskit' channel
    analyticsEvent.fire('atlaskit');

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  };

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

const Button = withCreateAnalyticsEvent()(ButtonBase);

// eslint-disable-next-line react/no-multi-comp
export default class App extends Component<void> {
  handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { action, payload, context } = analyticsEvent;
    console.log('Received event:', { action, payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <AnalyticsContext data={{ issueId: 123 }}>
          <Button>I have context now</Button>
        </AnalyticsContext>
      </AnalyticsListener>
    );
  }
}
