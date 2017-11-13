// @flow

import React from 'react';
import { CalendarStateless } from '../src';
import { getDates } from './_';

export default () => <CalendarStateless disabled={getDates()} />;
