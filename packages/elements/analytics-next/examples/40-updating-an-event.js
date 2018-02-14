// @flow
import React, { Component } from 'react';
import {
  AnalyticsContext,
  AnalyticsListener,
  UIAnalyticsEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '../src';

const Button = withAnalyticsContext({ component: 'button' })(
  withAnalyticsEvents({ onClick: { action: 'click' } })(
    ({ createAnalyticsEvent, ...props }) => <button {...props} />,
  ),
);

const Input = withAnalyticsContext({ component: 'text-field' })(
  withAnalyticsEvents({ onKeyDown: { action: 'keydown' } })(
    ({ createAnalyticsEvent, ...props }) => <input {...props} type="text" />,
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
    analyticsEvent
      .update(payload => ({
        ...payload,
        action: 'submit',
        originalInteraction: payload.action,
        value: this.state.value,
      }))
      .fire('jira');
  };

  render() {
    return (
      <AnalyticsContext data={{ component: 'form' }}>
        <div>
          <Input
            onChange={this.handleInputChange}
            onKeyDown={this.handleInputKeyDown}
            value={this.state.value}
          />
          <Button
            analyticsContext={{ component: 'submit-button' }}
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
    const { payload, context } = analyticsEvent;
    console.log('Received event:', { payload, context });
  };

  render() {
    return (
      <AnalyticsListener channel="jira" onEvent={this.handleEvent}>
        <Form />
      </AnalyticsListener>
    );
  }
}
