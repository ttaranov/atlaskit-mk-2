// @flow

import React from 'react';
import Button from '@atlaskit/button';
import EmptyState from '../src/EmptyState';
import exampleImage from './img/example-image.png';

const props = {
  header: 'I am the header',
  imageUrl: exampleImage,
};

export default () => <EmptyState {...props} />;
