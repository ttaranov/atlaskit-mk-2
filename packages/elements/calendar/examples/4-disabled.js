// @flow

import React from 'react';
import { CalendarStateless } from '../src';
import { getDates } from './_';

module.exports = () => <CalendarStateless disabled={getDates()} />;
