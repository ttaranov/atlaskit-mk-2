// @flow

import React from 'react';
import { CalendarStateless } from '../src';
import { getDates } from './utils/_';

export default () => <CalendarStateless disabled={getDates()} />;
