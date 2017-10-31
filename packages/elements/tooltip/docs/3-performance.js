// @flow

import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ${<Example
    Component={require('../examples/perf-test').default}
    source={require('!!raw-loader!../examples/perf-test')}
    title="Benchmark"
  />}
`;
