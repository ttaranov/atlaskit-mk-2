// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import Checkbox, { CheckboxStateless, CheckboxGroup } from '../src';
import { name } from '../package.json';
import { borderRadius, colors } from '@atlaskit/theme';
const containerStyle = {
  padding: 20,
  backgroundColor: 'white',
  width: 500,
};

export default class CheckboxExample extends PureComponent {
  state = { isChecked: false };
  onChange = () => {
    console.log('onchange called for', this.props.value);
    this.setState({ isChecked: !this.state.isChecked });
  };

  render() {
    return (
      <div>
        <div style={containerStyle}>
          <h2>Default use</h2>
          <Checkbox
            label="Default checkbox usage"
            onChange={checked =>
              console.log('checkbox state changed: ', checked)
            }
            value="default"
            name="default"
          />
        </div>

        <div style={containerStyle}>
          <h2>When checkbox is checked by default</h2>
          <Checkbox
            initiallyChecked
            label="Checkbox begins checked"
            onChange={checked =>
              console.log('checkbox state changed: ', checked)
            }
            value="default"
            name="default"
          />
        </div>

        <div style={containerStyle}>
          <h2>Disabled checkbox</h2>
          <Checkbox
            initiallyChecked
            isDisabled
            label="disabled checkbox"
            onChange={checked =>
              console.log('the checkbox is checked: ', checked)
            }
            value="default"
            name="default"
          />
          <Checkbox
            isDisabled
            label="disabled checkbox"
            onChange={checked =>
              console.log('the checkbox is checked: ', checked)
            }
            value="default"
            name="default"
          />
        </div>

        <div>
          <h2>Is full width</h2>
          <div style={{ ...containerStyle, border: '1px solid steelblue' }}>
            <Checkbox
              label="Full width checkbox"
              isFullWidth
              onChange={() => {}}
              value="default"
              name="default"
            />
          </div>
          <div style={{ ...containerStyle, border: '1px solid steelblue' }}>
            <Checkbox
              label="Normal width checkbox"
              onChange={() => {}}
              value="default"
              name="default"
            />
          </div>
        </div>
      </div>
    );
  }
}
