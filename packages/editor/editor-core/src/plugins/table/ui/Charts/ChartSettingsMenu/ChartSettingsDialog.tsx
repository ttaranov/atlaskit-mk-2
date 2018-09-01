import * as React from 'react';
import styled from 'styled-components';
import Select from '@atlaskit/select';
import Checkbox from '@atlaskit/checkbox';
import { ChartSettings, ChartSetting } from '../../../graphs';

export const SettingsItem: any = styled.div`
  & {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  h6 {
    padding: 4px 0;
  }

  label {
    font-size: 13px;
    /*font-weight: bold;*/
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
        <div>
          <h6>{setting.title}</h6>
          <Select
            isSearchable={false}
            options={this.props.columns.map((colname, idx) => {
              return { label: colname, value: idx };
            })}
            value={{
              label: this.props.columns[
                this.props.currentSettings[setting.name]
              ],
              value: this.props.currentSettings[setting.name],
            }}
            onChange={event => {
              this.props.onChange(setting.name, event.value);

              // refresh chart title if we changed the source column
              if (
                setting.name === 'values' &&
                this.props.currentSettings['title']
              ) {
                this.props.onChange('title', this.props.columns[event.value]);
              }
            }}
          />
        </div>
      );
    } else if (setting.input === 'checkbox') {
      return (
        <div>
          <Checkbox
            initiallyChecked={this.props.currentSettings[setting.name]}
            value={this.props.currentSettings[setting.name]}
            label={setting.title}
            onChange={({ event, isChecked }) => {
              this.props.onChange(setting.name, isChecked);
            }}
            name={setting.name}
          />
        </div>
      );
    } else if (setting.input === 'select') {
      const currentValue = setting.values!.find(optionValue => {
        return optionValue.value === this.props.currentSettings[setting.name];
      });

      return (
        <div>
          <h6>{setting.title}</h6>
          <Select
            isSearchable={false}
            options={setting.values}
            value={currentValue}
            onChange={event => {
              this.props.onChange(setting.name, event.value);
            }}
          />
        </div>
      );
    } else if (setting.input === 'title') {
      if (!this.props.currentSettings['values']) {
        return;
      }

      // set the title field value to be the title of the source column
      // FIXME: not always called 'values'
      const targetColName = this.props.columns[
        this.props.currentSettings['values']
      ];
      return (
        <div>
          <Checkbox
            initiallyChecked={this.props.currentSettings[setting.name]}
            value={this.props.currentSettings[setting.name]}
            label={setting.title}
            onChange={({ event, isChecked }) => {
              this.props.onChange(setting.name, isChecked ? targetColName : '');
            }}
            name={setting.name}
          />
        </div>
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
          maxHeight: '250px',
        }}
      >
        {this.props.availableChartSettings.map(availableSetting => {
          return (
            <SettingsItem>{this.renderSetting(availableSetting)}</SettingsItem>
          );
        })}
      </div>
    );
  }
}
