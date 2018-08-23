// @flow

import React from 'react';
import FeedbackCollector from '../src';

export default () => (
  <FeedbackCollector
    onSubmit={value => console.log(value)}
    onClose={() => console.log('close')}
  />
);
