// @flow

import React from 'react';
import { Max } from '../src';

export default function Example() {
  return (
    <ul>
      <li>
        <Max>{100}</Max>
      </li>
      <li>
        <Max limit={10}>{100}</Max>
      </li>
      <li>
        <Max>{Infinity}</Max>
      </li>
      <li>
        <Max max={10}>{Infinity}</Max>
      </li>
    </ul>
  );
}
