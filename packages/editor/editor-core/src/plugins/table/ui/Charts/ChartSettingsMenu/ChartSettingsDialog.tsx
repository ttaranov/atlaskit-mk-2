import * as React from 'react';
import styled from 'styled-components';
import Select from '@atlaskit/select';
import { ChartSettings, ChartSetting } from '../../../graphs';

export const SettingsItem: any = styled.div`
  h5 {
    padding: 10px 0;
  }
`;

export interface DialogProps {
  availableChartSettings: ChartSettings;
  columns: string[];
  currentSettings: object;
  onChange: (key: string, value: any) => void;
}

export class ChartSettingsDialog extends React.Component<DialogProps> {
  renderSetting(setting: ChartSetting) {
    if (setting.input === 'column-select') {
      return (
        <Select
          isSearchable={false}
          options={this.props.columns.map((colname, idx) => {
            return { label: colname, value: idx };
          })}
          value={{
            label: this.props.columns[this.props.currentSettings[setting.name]],
            value: this.props.currentSettings[setting.name],
          }}
          onChange={e => {
            this.props.onChange(setting.name, e.value);
          }}
        />
      );
    } else if (setting.input === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={this.props.currentSettings[setting.name]}
          onChange={e => this.props.onChange(setting.name, e.target.checked)}
        />
      );
    } else if (setting.input === 'select') {
      const currentValue = setting.values!.find(optionValue => {
        return optionValue.value === this.props.currentSettings[setting.name];
      });

      return (
        <Select
          isSearchable={false}
          options={setting.values}
          value={currentValue}
          onChange={e => {
            this.props.onChange(setting.name, e.value);
          }}
        />
      );
    }

    console.warn('cannot render setting', setting);
    return null;
  }

  render() {
    return (
      <div
        style={{
          width: '200px',
          maxHeight: '200px',
        }}
      >
        {this.props.availableChartSettings.map(availableSetting => {
          return (
            <SettingsItem>
              <h5>{availableSetting.title}</h5>
              {this.renderSetting(availableSetting)}
            </SettingsItem>
          );
        })}
      </div>
    );
  }
}
