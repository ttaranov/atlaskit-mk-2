// @flow

import React from 'react';
import EmptyState from '../src/EmptyState';
import props from './common/Props';

const newProps = { ...props, size: 'narrow' };

export default () => <EmptyState {...newProps} />;
