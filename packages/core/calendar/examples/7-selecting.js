// @flow

import React from 'react';
import { CalendarStateless } from '../src';

function pad(num) {
  return num < 10 ? `0${num}` : num;
}

function dateToString(date, { fixMonth } = {}) {
  return `${date.year}-${pad(date.month + (fixMonth ? 1 : 0))}-${pad(
    date.day,
  )}`;
}

const now = new Date();

function getDate(day: number = now.getDate()) {
  return dateToString({
    day,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
}

const dates = [getDate(), getDate(3), getDate(20)];

export default () => (
  <div>
    <CalendarStateless selected={dates} />
    <CalendarStateless previouslySelected={dates} />
  </div>
);
