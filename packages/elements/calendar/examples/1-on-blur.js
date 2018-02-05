// @flow

import React from 'react';
import { CalendarStateless } from '../src';

export default () => <CalendarStateless onBlur={e => console.log('blur', e)} />;
