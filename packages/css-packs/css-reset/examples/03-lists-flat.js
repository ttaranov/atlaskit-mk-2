// @flow
import React from 'react';

export default () => (
  <div>
    <h2>{`<ul>`}</h2>
    <ul>
      <li>First list item</li>
      <li>Second list item</li>
      <li>Third list item</li>
    </ul>
    <h2>&lt;ol&gt;</h2>
    <ol>
      <li>First list item</li>
      <li>Second list item</li>
      <li>Third list item</li>
    </ol>
    <h2>&lt;dl&gt;</h2>
    <dl>
      <dt>First definition</dt>
      <dd>Definition description</dd>
      <dd>Definition description</dd>
      <dt>Second definition</dt>
      <dd>Definition description</dd>
      <dt>Third definition</dt>
    </dl>
  </div>
);
