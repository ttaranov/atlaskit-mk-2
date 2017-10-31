// @flow

import React, { Component } from 'react';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';

type State = {
  isCompleting: boolean,
};

class StatefulSpinnerExample extends Component<Props, State> {
  state = {
    isCompleting: false,
  }

  completeSpinner = () => this.setState({ isCompleting: !this.state.isCompleting })

  render() {
    return (
      <div>
        <div>
          <Button onClick={this.completeSpinner}>Toggle Spinners</Button>
        </div>
        <Spinner
          size="xlarge"
          delay={3000}
          isCompleting={this.state.isCompleting}
        />
        <Spinner
          size="xlarge"
          isCompleting={this.state.isCompleting}
        />
      </div>
    );
  }
}

export default StatefulSpinnerExample;
