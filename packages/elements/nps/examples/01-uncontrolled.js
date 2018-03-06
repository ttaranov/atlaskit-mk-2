// @flow
import React from 'react';
import AkNPS from '../src/NPS';

export default class extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      dismissCount: 0,
      optOutCount: 0,
      page1SubmitCount: 0,
      submitCount: 0,
    };
  }

  render() {
    return (
      <div>
        <div>Dismiss Count: {this.state.dismissCount}</div>
        <div>Opt Out Count: {this.state.optOutCount}</div>
        <div>Page 1 Submit Count: {this.state.page1SubmitCount}</div>
        <div>Submit Count: {this.state.submitCount}</div>
        <AkNPS
          isOpen
          isDismissable
          canOptOut
          onSubmitPage1={() => {
            this.setState({
              page1SubmitCount: this.state.page1SubmitCount + 1,
            });
          }}
          onSubmit={() => {
            this.setState({
              submitCount: this.state.submitCount + 1,
            });
          }}
          onDismiss={() => {
            this.setState({
              dismissCount: this.state.dismissCount + 1,
            });
          }}
          onOptOut={() => {
            this.setState({
              optOutCount: this.state.optOutCount + 1,
            });
          }}
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
