// @flow
import React from 'react';
import AkNPS from '../src/NPS';

export default class extends React.Component<any, any> {
  constructor(...args: Array<any>) {
    super(...args);
    this.state = {
      page1SubmitCount: 0,
      submitCount: 0,
    };
  }

  render() {
    return (
      <div>
        <div>Page 1 Submit Count: {this.state.page1SubmitCount}</div>
        <div>Submit Count: {this.state.submitCount}</div>
        <AkNPS
          isDismissable
          canOptOut
          onSubmitPage1={() => {
            this.setState({
              page1SubmitCount: this.state.page1SubmitCount + 1,
            });
          }}
          onSubmit={() => {
            console.log('here');
            this.setState({
              submitCount: this.state.submitCount + 1,
            });
          }}
          onDismiss={() => {}}
          onOptOut={() => {}}
          roles={[
            {
              value: 'engineering',
              text: 'Engineering',
            },
          ]}
          strings={{
            product: 'Stride',
            page1Subheader: 'I want to override the Page 1 Subheader',
          }}
        />
      </div>
    );
  }
}
