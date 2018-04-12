// @flow

import React, { Component } from 'react';
import { AvatarGroup } from '../src/';

const getData = text => [
  {
    name: `Miss Piggy approved ${text}`,
    appearance: 'circle',
    size: 'small',
    enableTooltip: true,
  },
  {
    name: `Miss Piggy approved ${text}`,
    appearance: 'circle',
    size: 'small',
    enableTooltip: true,
  },
  {
    name: `Miss Piggy approved ${text}`,
    appearance: 'circle',
    size: 'small',
    enableTooltip: true,
  },
  {
    name: `Miss Piggy approved ${text}`,
    appearance: 'circle',
    size: 'small',
    enableTooltip: true,
  },
  {
    name: `Miss Piggy approved ${text}`,
    appearance: 'circle',
    size: 'small',
    enableTooltip: true,
  },
];

export default class Test extends Component<*, *> {
  textStates = ['2017‑12‑08', 'someReallyLongWord', 'someReallyLongW'];

  state = {
    text: 0,
  };

  toggleText = () => {
    this.setState({
      text: (this.state.text + 1) % this.textStates.length,
    });
  };

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={this.toggleText}>Toggle Text</button>
        <AvatarGroup
          appearance="grid"
          onAvatarClick={console.log}
          data={getData(this.textStates[this.state.text])}
          size="small"
          maxCount={4}
          truncate
        />
      </div>
    );
  }
}
