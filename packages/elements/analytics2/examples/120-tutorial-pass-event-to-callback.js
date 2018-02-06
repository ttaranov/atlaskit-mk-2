// @flow
import React, { Component } from 'react';
import {
  AnalyticsListener,
  UIAnalyticsEvent,
  withCreateAnalyticsEvent,
} from '../src';

class ManualButtonBase extends Component<*> {
  handleClick = e => {
    // Create our analytics event
    const analyticsEvent = this.props.createAnalyticsEvent('click');

    if (this.props.onClick) {
      // Pass the event through the corresponding callback prop
      this.props.onClick(e, analyticsEvent);
    }
  };

  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} onClick={this.handleClick} />;
  }
}

// eslint-disable-next-line react/no-multi-comp
class ButtonBase extends Component<*> {
  render() {
    const { createAnalyticsEvent, ...props } = this.props;
    return <button {...props} />;
  }
}

const ManualButton = withCreateAnalyticsEvent()(ManualButtonBase);
const VerboseButton = withCreateAnalyticsEvent({
  onClick: create => create('click'),
})(ButtonBase);
const ShorthandButton = withCreateAnalyticsEvent({ onClick: 'click' })(
  ButtonBase,
);

const ButtonGroup = () => {
  const onClick = (e, analyticsEvent) => analyticsEvent.fire('atlaskit');
  return (
    <div>
      <div>
        <ManualButton onClick={onClick}>
          Manually passing the event
        </ManualButton>
      </div>
      <div>
        <VerboseButton onClick={onClick}>
          Passing with verbose eventMap option
        </VerboseButton>
      </div>
      <div>
        <ShorthandButton onClick={onClick}>
          Passing with shorthand eventMap option
        </ShorthandButton>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/no-multi-comp
export default class App extends Component<void> {
  handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { action, payload, context } = analyticsEvent;
    console.log('Received event:', { action, payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <ButtonGroup />
      </AnalyticsListener>
    );
  }
}
