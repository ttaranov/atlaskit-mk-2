// @flow
import React, { PureComponent } from 'react';
import { type FieldComponentsType } from '../data/fieldComponents';

type Props = {
  components: FieldComponentsType,
};

export default class ComponentsTable extends PureComponent<Props, void> {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Package</th>
            <th>Version</th>
            <th>Component</th>
            <th>Support</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {this.props.components.map(({ name, version }) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{version}</td>
              <td>x</td>
              <td>x</td>
              <td>x</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
