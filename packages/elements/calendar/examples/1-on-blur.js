// @flow

import React from 'react';
import { CalendarStateless } from '../src';
import { action } from './_';

export default() => <CalendarStateless onBlur={action('blur')} />;
