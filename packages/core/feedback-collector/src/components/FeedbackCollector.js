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
  onClose: func,
  email: string,
  name: string,
  requestTypeId: string,
  embeddableKey: string,
};

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
};

export default class FeedbackCollector extends Component<Props, State> {
  truncate: string = (text: string) => {
    if (text.length < 50) {
      return text;
    }
    return text.replace(/\n/g, ' ').substring(0, 49) + '...';
  };

  mapFormToJSD: feedbackType = (formValues: FormFields) => {
    const fields = [
      { id: TYPE_ID, value: { id: TYPE_VALUE_ID[formValues.type] } },
      { id: SUMMARY_ID, value: this.truncate(formValues.description) },
      { id: DESCRIPTION_ID, value: formValues.description },
      { id: EMAIL_ID, value: this.props.email },
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
    ).then(r => {
      if (r.ok) console.log('Success!');
      this.props.onClose();
      // return r.json()
    });
  };

  render() {
    return (
      <FeedbackForm onSubmit={this.postFeedback} onClose={this.props.onClose} />
    );
  }
}
