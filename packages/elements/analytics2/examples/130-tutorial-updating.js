// @flow
import React, { Component } from 'react';
import {
  AnalyticsContext,
  AnalyticsListener,
  UIAnalyticsEvent,
  withAnalyticsContext,
  withCreateAnalyticsEvent,
} from '../src';

// eslint-disable-next-line react/no-multi-comp
class ButtonBase extends Component<*> {
  render() {
    const { analyticsNamespace, createAnalyticsEvent, ...props } = this.props;
    return <button {...props} />;
  }
}

const Button = withAnalyticsContext({ namespace: 'button' })(
  withCreateAnalyticsEvent({ onClick: 'click' })(ButtonBase),
);

const Input = withAnalyticsContext({ namespace: 'text-field' })(
  withCreateAnalyticsEvent({ onKeyDown: 'keydown' })(
    ({ analyticsNamespace, createAnalyticsEvent, ...props }) => {
      return <input {...props} type="text" />;
    },
  ),
);

// eslint-disable-next-line react/no-multi-comp
class Form extends Component<*, { value: string }> {
  state = {
    value: 'Field value',
  };

  handleInputChange = e => this.setState({ value: e.target.value });

  handleInputKeyDown = (e, analyticsEvent) => {
    if (e.key === 'Enter') {
      this.onSubmit(analyticsEvent);
    }
  };

  handleSubmitButtonClick = (e, analyticsEvent) => {
    this.onSubmit(analyticsEvent);
  };

  onSubmit = analyticsEvent => {
    analyticsEvent.update({ value: this.state.value }).fire('atlaskit');
  };

  render() {
    return (
      <AnalyticsContext data={{ namespace: 'form' }}>
        <div>
          <Input
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            value={this.state.value}
          />
          <Button
            analyticsNamespace={{ namespace: 'submit-button' }}
            onClick={this.handleSubmitButtonClick}
          >
            Submit
          </Button>
        </div>
      </AnalyticsContext>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
export default class App extends Component<void> {
  handleEvent = (analyticsEvent: UIAnalyticsEvent) => {
    const { action, payload, context } = analyticsEvent;
    console.log('Received event:', { action, payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.handleEvent}>
        <Form />
      </AnalyticsListener>
    );
  }
}
