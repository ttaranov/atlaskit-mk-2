// @flow
import React, { Component, Fragment } from 'react';
import Button from '@atlaskit/button';
import TableTree from '../src';
import staticData from './data-structured-nodes.json';

/* eslint-disable react/no-unused-prop-types */
type ExampleItemData = { title: string, numbering: string };
const Title = (props: ExampleItemData) => <span>{props.title}</span>;
const Numbering = (props: ExampleItemData) => <span>{props.numbering}</span>;
/* eslint-enable react/no-unused-prop-types */

export default class UpdateData extends Component<*, *> {
  state = {
    data: staticData.children,
  };

  updateData = () => {
    const nextId = this.state.data.length + 1;
    const newItem = {
      id: nextId,
      content: {
        title: `New Entry: ${nextId}`,
        numbering: nextId,
      },
      hasChildren: false,
    };
    this.setState({
      data: [...this.state.data, newItem],
    });
  };

  render() {
    return (
      <Fragment>
        <Button onClick={this.updateData}>Add new Item</Button>
        <TableTree
          headers={['Title', 'Numbering']}
          columns={[Title, Numbering]}
          columnWidths={['200px', '200px']}
          items={this.state.data}
        />
      </Fragment>
    );
  }
}
