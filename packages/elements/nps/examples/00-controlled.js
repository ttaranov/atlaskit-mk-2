// @flow
import React from 'react';
import AkNPS from '../src/NPS';

export default class extends React.Component<any, any> {
  render() {
    return (
      <div>
        <AkNPS
          isDismissable
          canOptOut
          onFeedbackSubmit={() => {}}
          onFollowupSubmit={() => {}}
          onFinish={() => {}}
          onDismiss={() => {}}
          onOptOut={() => {}}
          roles={['Engineering']}
          product="Stride"
          strings={{
            feedbackDescription: 'I want to override the Feedback Description',
          }}
        />
      </div>
    );
  }
}
