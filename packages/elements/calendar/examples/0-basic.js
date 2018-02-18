// @flow

import React from 'react';
import Calendar from '../src';

export default () => <Calendar onUpdate={e => console.log('onUpdate', e)} />;
