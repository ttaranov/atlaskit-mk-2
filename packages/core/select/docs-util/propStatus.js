// @flow
import React, { Component, Fragment, type Node } from 'react';
import { code } from '@atlaskit/docs';

const Cell = ({ children }: { children: Node }) => (
  <td
    css={{
      fontSize: '90%',
      padding: '4px 8px 4px 0',
      borderBottom: '1px solid #eee',
      verticalAlign: 'top',
    }}
  >
    {children}
  </td>
);

export default class PropStatus extends Component<*> {
  renderStatus() {
    const { status, note } = this.props;
    switch (status) {
      case 'components':
        return (
          <Fragment>
            <Cell>removed</Cell>
            <Cell>use the new Components API</Cell>
          </Fragment>
        );
      case 'styles':
        return (
          <Fragment>
            <Cell>removed</Cell>
            <Cell>use the new Styles API</Cell>
          </Fragment>
        );
      case 'renamed':
        return (
          <Fragment>
            <Cell>renamed</Cell>
            <Cell>
              use <code>{note}</code>
            </Cell>
          </Fragment>
        );
      default:
        return (
          <Fragment>
            <Cell>{status}</Cell>
            <Cell>{note}</Cell>
          </Fragment>
        );
    }
  }
  render() {
    const { prop } = this.props;
    return (
      <tr>
        <Cell>
          <code>{prop}</code>
        </Cell>
        {this.renderStatus()}
      </tr>
    );
  }
}
