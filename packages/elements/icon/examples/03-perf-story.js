// @flow
/* eslint-disable react/prop-types, react/no-multi-comp */
import React, { Component } from 'react';

import AtlassianIcon from '../glyph/atlassian';

const PER_RUN = 100;
const TEST_RUNS = 5;

// 5 Runs of 100
// Before: 1007ms
// After Oscar: 578ms
// After Sean: 297ms

// 1 Run of 500
// Before: 838ms
// After Oscar: 325ms
// After Sean: 239ms

export default class PerfTest extends Component<{}, { count: number }> {
  state = {
    count: 0,
  };
  startTest = () => {
    console.log('Starting performance test...');
    let runs = 0;
    let startTime;
    const run = () => {
      if (!runs) {
        startTime = Date.now();
      }
      if (runs === TEST_RUNS) {
        const time = Date.now() - startTime;
        console.log(`Finished performance test in ${time}ms`);
        return;
      }
      runs++;
      this.setState({ count: runs * PER_RUN }, run);
    };
    this.setState({ count: 0 }, run);
  };
  renderIcons() {
    const { count } = this.state;
    const icons = [];
    for (let i = 1; i <= count; i++) {
      icons.push(
        <AtlassianIcon
          key={`icons-${i}`}
          label="Atlassian icon"
          size="medium"
        />,
      );
    }
    return icons;
  }
  render() {
    return (
      <div>
        <button type="button" onClick={this.startTest}>
          Start Test
        </button>
        <div>{this.renderIcons()}</div>
      </div>
    );
  }
}
