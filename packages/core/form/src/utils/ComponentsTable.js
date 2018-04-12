// @flow
import React, { PureComponent } from 'react';
import { type FieldComponentsType } from '../data/fieldComponents';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import Tooltip from '@atlaskit/tooltip';

type Props = {
  components: FieldComponentsType,
};

export default class ComponentsTable extends PureComponent<Props, void> {
  renderSupportIcon = (support: number) => {
    if (support) return <CheckCircleIcon />;
    return null;
  };

  renderSupportInfo = (info: string = '') => {
    if (info.length)
      return (
        <Tooltip content={info}>
          <EditorWarningIcon />
        </Tooltip>
      );
    return null;
  };

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Package</th>
            <th>Version</th>
            <th>Component</th>
            <th>Supported</th>
            <th>Info</th>
          </tr>
        </thead>
        <tbody>
          {this.props.components.map(component => (
            <tr key={component.component}>
              <td>{component.package}</td>
              <td>{component.version}</td>
              <td>{component.component}</td>
              <td>{this.renderSupportIcon(component.support)}</td>
              <td>{this.renderSupportInfo(component.supportInfo)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
