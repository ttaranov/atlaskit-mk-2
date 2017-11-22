// @flow

import React from 'react';
import EmptyState from '../src/EmptyState';
import props from './common/props';

const newProps = { ...props, primaryAction: undefined };

export default () => <EmptyState {...newProps} />;
