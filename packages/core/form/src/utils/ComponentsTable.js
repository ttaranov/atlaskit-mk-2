// @flow
import React, { PureComponent } from 'react';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import EditorWarningIcon from '@atlaskit/icon/glyph/editor/warning';
import { colors } from '@atlaskit/theme';
/* eslint-disable import/no-extraneous-dependencies */
import Tooltip from '@atlaskit/tooltip';
import { type FieldComponentsType } from '../data/fieldComponents';

type Props = {
  components: FieldComponentsType,
};

export default class ComponentsTable extends PureComponent<Props, void> {
  renderSupportIcon = (support: number) => {
    if (support) return <CheckCircleIcon primaryColor={colors.G400} />;
    return <CrossCircleIcon primaryColor={colors.R400} />;
  };

  renderSupportInfo = (info: string = '') => {
    if (info.length)
      return (
        <Tooltip content={info}>
          <EditorWarningIcon primaryColor={colors.Y400} />
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
