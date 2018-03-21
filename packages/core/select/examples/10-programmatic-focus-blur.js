// @flow
import React, { Component, Fragment, type ElementRef } from 'react';
import Btn from '@atlaskit/button';
import Select from '../src';

const Button = ({ inline = true, ...props }: { inline?: boolean }) => (
  <div
    style={{
      display: inline ? 'inline-block' : 'block',
      paddingRight: 8,
      paddingTop: 8,
    }}
  >
    <Btn {...props} />
  </div>
);

export default class FocusBlurSelect extends Component<*> {
  select: ElementRef<*>;
  focus = () => {
    this.select.focus();
  };
  blur = () => {
    this.select.blur();
  };
  render() {
    return (
      <Fragment>
        <Select
          ref={ref => {
            this.select = ref;
          }}
          options={[
            { label: 'Adelaide', value: 'adelaide' },
            { label: 'Brisbane', value: 'brisbane' },
            { label: 'Canberra', value: 'canberra' },
            { label: 'Darwin', value: 'darwin' },
            { label: 'Hobart', value: 'hobart' },
            { label: 'Melbourne', value: 'melbourne' },
            { label: 'Perth', value: 'perth' },
            { label: 'Sydney', value: 'sydney' },
          ]}
          placeholder="Choose a City"
        />
        <div>
          <Button onClick={this.focus}>Focus</Button>
          <Button onClick={this.blur}>Blur</Button>
        </div>
      </Fragment>
    );
  }
}
