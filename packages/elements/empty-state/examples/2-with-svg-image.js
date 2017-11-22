// @flow

import React from 'react';
import EmptyState from '../src/EmptyState';
import props from './common/Props';
import exampleImage from './common/img/example-image.svg';

const newProps = { ...props, imageUrl: exampleImage };

export default () => <EmptyState {...newProps} />;
