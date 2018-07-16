// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import FieldRadioGroup, { AkRadio } from '../src';
import type { ItemsPropTypeSmart } from '../src/types';

const formTestUrl = '//httpbin.org/get';
const colorItems: ItemsPropTypeSmart = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue', defaultSelected: true },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
];
const fruitItems: ItemsPropTypeSmart = [
  { name: 'fruit', value: 'apple', label: 'Apple' },
  { name: 'fruit', value: 'orange', label: 'Orange' },
  { name: 'fruit', value: 'peach', label: 'Peach', defaultSelected: true },
  { name: 'fruit', value: 'pair', label: 'Pair' },
];

export default class FormExample extends Component<void, void> {
  onRadioChange = (event: any) => {
    console.log(event.target.value);
  };
  render() {
    return (
      <div>
        <form
          action={formTestUrl}
          method="get"
          style={{ backgroundColor: 'white' }}
          target="submitFrame"
        >
          <AkRadio
            name="standalone"
            value="single-radio"
            onChange={this.onRadioChange}
          >
            Single Radio button
          </AkRadio>
          <FieldRadioGroup
            items={colorItems}
            label="Pick a color:"
            onRadioChange={this.onRadioChange}
            isRequired
          />
          <FieldRadioGroup
            items={fruitItems}
            label="Pick a fruit:"
            onRadioChange={this.onRadioChange}
          />
          <p>
            <Button type="submit" appearance="primary">
              Submit
            </Button>
          </p>
        </form>
        <p>The data submitted by the form will appear below:</p>
        <iframe
          src=""
          title="Checkbox Resopnse Frame"
          id="submitFrame"
          name="submitFrame"
          style={{
            width: '95%',
            height: '300px',
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        />
      </div>
    );
  }
}
