// @flow

import React from 'react';
import Calendar from '../src';
import { action } from './_';

export default () => <Calendar onUpdate={action('onUpdate')} />;
