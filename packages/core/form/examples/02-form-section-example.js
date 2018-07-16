// @flow
import React, { PureComponent } from 'react';

type State = {|
  eventResult: string,
|};

export default class SectionExample extends PureComponent<void, State> {
  state = {
    eventResult:
      'Click into and out of the input above to trigger onBlur & onFocus in the Fieldbase',
  };

  render() {
    return (
      <div>
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.eventResult}
        </div>
      </div>
    );
  }
}
