// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import { Checkbox } from '@atlaskit/checkbox';
import DownIcon from '@atlaskit/icon/glyph/hipchat/chevron-down';
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

type State = {
  values: Array<Object>,
  valuesString: string,
  placeholder: string,
  controlShouldRenderValue: boolean,
};
class MultiPopupSelectExample extends Component<*, State> {
  state = {
    values: [options[0]],
    valuesString: '',
    placeholder: 'Choose value...',
    controlShouldRenderValue: false,
  };
  componentWillMount() {
    this.setState(state => ({
      valuesString: state.values.map(v => v.label).join(', '),
    }));
  }
  onChange = (values: any) => {
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
    const {
      placeholder,
      valuesString,
      values,
      controlShouldRenderValue,
    } = this.state;
    return (
      <div>
        <div
          style={{
            display: 'inline-block',
            maxWidth: '250px',
          }}
        >
          <PopupSelect
            {...defaults}
            controlShouldRenderValue={controlShouldRenderValue}
            closeMenuOnSelect={false}
            onChange={this.onChange}
            value={values}
            target={
              <Button iconAfter={<DownIcon />}>
                {valuesString || placeholder}
              </Button>
            }
            isMulti
          />
        </div>
        <div>
          <Checkbox
            value="show value in search"
            name="toggleValue"
            onChange={this.toggleConfig}
            label="show value in search"
          />
        </div>
      </div>
    );
  }
}

export default MultiPopupSelectExample;
