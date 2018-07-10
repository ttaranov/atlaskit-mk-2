// @flow
import React, { Fragment, Component } from 'react';
import Button from '@atlaskit/button';
import Checkbox from '@atlaskit/checkbox';
import { PopupSelect } from '../src';

const options = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

const defaults = { options, placeholder: 'Choose a City' };

class MultiPopupSelectExample extends Component {
  state = {
    values: [options[0]],
    placeholder: 'Choose value...',
  };
  componentWillMount() {
    this.setState(state => ({
      valuesString: state.values.map(v => v.label).join(', '),
    }));
  }
  onChange = values => {
    this.setState({
      values,
      valuesString: values.map(v => v.label).join(', '),
    });
  };
  toggleConfig = () => {
    this.setState(state => ({
      controlShouldRenderValue: !state.controlShouldRenderValue,
    }));
  };

  render() {
    return (
      <Fragment>
        <PopupSelect
          {...defaults}
          controlShouldRenderValue={this.state.controlShouldRenderValue}
          hideSelectedOptions={false}
          onChange={this.onChange}
          value={this.state.values}
          target={
            <Button>{this.state.valuesString || this.state.placeholder}</Button>
          }
          isMulti
        />
        <div>
          <Checkbox onChange={this.toggleConfig} label="show value in search" />
        </div>
      </Fragment>
    );
  }
}

export default MultiPopupSelectExample;
