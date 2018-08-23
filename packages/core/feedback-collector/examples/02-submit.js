// @flow
import React, { Fragment, Component } from 'react';
import Button from '@atlaskit/button';
import FeedbackCollector from '../src';

type FeedbackFormValue = {
  type: string,
  description: string,
  contact: string,
  participant: string,
  email: string,
  name: string,
};

type feedbackType = {
  fields: Array<{
    id: string,
    value: string | boolean | Object | Array<Object>,
  }>,
};
const embeddableKey =
  process.env.API_KEY || '98d7ccb7-00ba-4207-9ba9-b16e919a20af';

const REQUEST_TYPE_ID = '24';

const feedbackFormValues: FeedbackFormValue = {
  type: '10105',
  description: 'Test from the component',
  contact: '10109',
  participant: '10110',
  email: 'thebestfeedback@atlassian.com',
  name: 'thebestcustomer',
};

const feedback: feedbackType = {
  fields: [
    { id: 'customfield_10042', value: { id: feedbackFormValues.type } },
    { id: 'summary', value: feedbackFormValues.description },
    { id: 'description', value: feedbackFormValues.description },
    { id: 'customfield_10043', value: [{ id: feedbackFormValues.contact }] },
    {
      id: 'customfield_10044',
      value: [{ id: feedbackFormValues.participant }],
    },
    { id: 'email', value: feedbackFormValues.email },
    { id: 'customfield_10045', value: feedbackFormValues.name },
  ],
};

const postFeedback = (data: FeedbackFormValue) => {
  fetch(
    `https://jsd-widget.atlassian.com/api/embeddable/${embeddableKey}/request?requestTypeId=${REQUEST_TYPE_ID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    },
  ).then(r => {
    if (r.ok) console.log('Success!');
    // return r.json()
  });
};

type State = { isOpen: boolean };
export default class DisplayFeedback extends Component<void, State> {
  state = { isOpen: false };
  formRef: any;

  open = () => this.setState({ isOpen: true });
  close = () => this.setState({ isOpen: false });

  // Form Event Handlers
  onSubmitHandler = () => {
    // $FlowFixMe - to fix later
    postFeedback(feedback);
  };

  render() {
    const { isOpen } = this.state;
    return (
      <div>
        <Button appearance="primary" onClick={this.open}>
          Display Feedback
        </Button>

        {isOpen && (
          <Fragment>
            <FeedbackCollector />
            <Button onClick={this.onSubmitHandler} appearance="primary">
              Send Feedback
            </Button>
          </Fragment>
        )}
      </div>
    );
  }
}
