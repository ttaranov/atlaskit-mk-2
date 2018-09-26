// @flow
import React, { Component } from 'react';
import FeedbackForm from './FeedbackForm';
import type { FormFields } from '../types';

type feedbackType = {
  fields: Array<{
    id: string,
    value: string | Object | Array<Object>,
  }>,
};

type Props = {
  /** Function that will be called to initiate the exit transition. */
  onClose: () => void,
  /** Function that will be called optimistically after a delay when the feedback is submitted. */
  onSubmit: () => void,
  /** The customer email */
  email: string,
  /** The customer name */
  name: string,
  /** The request id to access the JSD widget service */
  requestTypeId: string,
  /** The embeddable key to access the JSD widget service */
  embeddableKey: string,
};

const EMAIL_PLACEHOLDER = 'do-not-reply@atlassian.com';
const TYPE_ID = 'customfield_10042';
const SUMMARY_ID = 'summary';
const DESCRIPTION_ID = 'description';
const CAN_BE_CONTACTED_ID = 'customfield_10043';
const CAN_BE_CONTACTED_VALUE_ID = '10109';
const ENROLL_IN_RESEARCH_GROUP_ID = 'customfield_10044';
const ENROLL_IN_RESEARCH_GROUP_VALUE_ID = '10110';
const EMAIL_ID = 'email';
const CUSTOMER_NAME_ID = 'customfield_10045';
const TYPE_VALUE_ID = {
  bug: '10105',
  comment: '10106',
  suggestion: '10107',
  question: '10108',
  empty: 'missing',
};

export default class FeedbackCollector extends Component<Props> {
  props: Props;

  truncate = (text: string) => {
    const newText = text.replace(/\n/g, ' ');
    if (newText.length < 50) {
      return newText;
    }
    return `${newText.substring(0, 49)}...`;
  };

  mapFormToJSD = (formValues: FormFields): feedbackType => {
    const email = formValues.canBeContacted
      ? this.props.email
      : EMAIL_PLACEHOLDER;
    const fields = [
      { id: TYPE_ID, value: { id: TYPE_VALUE_ID[formValues.type] } },
      { id: SUMMARY_ID, value: this.truncate(formValues.description) },
      { id: DESCRIPTION_ID, value: formValues.description },
      { id: EMAIL_ID, value: email },
      { id: CUSTOMER_NAME_ID, value: this.props.name },
    ];

    if (formValues.canBeContacted) {
      fields.push({
        id: CAN_BE_CONTACTED_ID,
        value: [{ id: CAN_BE_CONTACTED_VALUE_ID }],
      });
    }

    if (formValues.enrollInResearchGroup) {
      fields.push({
        id: ENROLL_IN_RESEARCH_GROUP_ID,
        value: [{ id: ENROLL_IN_RESEARCH_GROUP_VALUE_ID }],
      });
    }

    return { fields };
  };

  postFeedback = (formValues: FormFields) => {
    const body = this.mapFormToJSD(formValues);

    fetch(
      `https://jsd-widget.atlassian.com/api/embeddable/${
        this.props.embeddableKey
      }/request?requestTypeId=${this.props.requestTypeId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    this.props.onClose();
    // slightly delay confirming submit since we don't wait for the REST call to succeed
    setTimeout(this.props.onSubmit, 700);
  };

  render() {
    return (
      <FeedbackForm onSubmit={this.postFeedback} onClose={this.props.onClose} />
    );
  }
}
