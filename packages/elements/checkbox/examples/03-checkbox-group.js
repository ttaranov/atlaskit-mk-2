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

const formTestUrl = '//httpbin.org/get';

export default class CheckboxGroupExample extends PureComponent {
  state = { isChecked: false };
  onChange = () => {
    console.log('onchange called for', this.props.value);
    this.setState({ isChecked: !this.state.isChecked });
  };

  render() {
    return (
      <div>
        <form
          action={formTestUrl}
          method="get"
          style={{ backgroundColor: 'white', padding: '40px', width: '500px' }}
          target="myFrame"
        >
          <CheckboxGroup>
            <Checkbox
              label="One"
              onChange={checked =>
                console.log('the checkbox is checked: ', checked)
              }
              value="One"
              name="one"
            />
            <Checkbox
              label="Two"
              onChange={checked =>
                console.log('the checkbox is checked: ', checked)
              }
              value="Two"
              name="two"
            />
            <Checkbox
              label="Three"
              onChange={checked =>
                console.log('the checkbox is checked: ', checked)
              }
              value="Three"
              name="three"
            />
          </CheckboxGroup>
          <p>
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </p>
        </form>
        <p>The data submitted by the form will appear below:</p>
        <iframe
          src=""
          name="myFrame"
          style={{ width: '50%', height: '300px' }}
        />
      </div>
    );
  }
}
