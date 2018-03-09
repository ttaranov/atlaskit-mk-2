//@flow
import React from 'react';
import { DefaultNPS } from '../src';

export default class NPSExample extends React.Component<any, any> {
  constructor(...args: Array<any>) {
    super(...args);
    this.state = {
      finishSubmission: null,
    };
  }

  onFinish = (finishSubmission: any) => {
    this.setState({ finishSubmission });
  };

  render() {
    return (
      <div>
        <DefaultNPS
          // The "product" prop is required in this example to generate the default strings.
          product="Stride"
          onFinish={this.onFinish}
        />
        <h3>Submission</h3>
        {JSON.stringify(this.state.finishSubmission)}
      </div>
    );
  }
}
