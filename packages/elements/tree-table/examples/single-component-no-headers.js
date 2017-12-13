// @flow
import React from 'react';

import TreeTable from '../src';
import staticData from './data-structured-nodes.json';

/* eslint react/prop-types: 0 */
const Title = props => <span>{props.title}</span>;
const Numbering = props => <span>{props.numbering}</span>;

function getChildrenData(parent = staticData) {
  return parent.children || [];
}

export default () => (
  <TreeTable columns={[Title, Numbering]} data={getChildrenData} />
);
