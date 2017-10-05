// @flow
import React from 'react';
import Lozenge from '../src';

export default () => (
  <div>
    <h2>Subtle Lozenges</h2>
    <p><Lozenge>Default</Lozenge></p>
    <p><Lozenge appearance="success">Success</Lozenge></p>
    <p><Lozenge appearance="removed">Removed</Lozenge></p>
    <p><Lozenge appearance="inprogress">In Progress</Lozenge></p>
    <p><Lozenge appearance="new">New</Lozenge></p>
    <p><Lozenge appearance="moved">Moved</Lozenge></p>

    <h2>Bold Lozenges</h2>
    <p><Lozenge isBold>Default</Lozenge></p>
    <p><Lozenge appearance="success" isBold>Success</Lozenge></p>
    <p><Lozenge appearance="removed" isBold>Removed</Lozenge></p>
    <p><Lozenge appearance="inprogress" isBold>In Progress</Lozenge></p>
    <p><Lozenge appearance="new" isBold>New</Lozenge></p>
    <p><Lozenge appearance="moved" isBold>Moved</Lozenge></p>

    <h2>Overflowed Lozenge</h2>
    <p><Lozenge>Long text will be truncated after a point.</Lozenge></p>
  </div>
);
