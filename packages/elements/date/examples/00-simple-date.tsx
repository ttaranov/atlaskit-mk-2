import * as React from 'react';
import { Date, Color } from '../src';

const DateInP = ({ color }: { color?: Color }) => (
  <p>
    <Date value={586137600000} color={color} />
  </p>
);

export default () => (
  <div>
    <DateInP />
    <DateInP color="red" />
    <DateInP color="green" />
    <DateInP color="blue" />
    <DateInP color="purple" />
    <DateInP color="yellow" />
  </div>
);
