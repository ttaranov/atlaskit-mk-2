// @flow
import React, { Component } from 'react';
import { cities } from './common/data';
import { AsyncSelect } from '../src';

type State = {
  inputValue: string,
};

const filterCities = (inputValue: string) =>
  cities.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()));

const promiseOptions = inputValue =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(filterCities(inputValue));
    }, 1000);
  });

export default function WithPromises (props) {
  const state = useState({ inputValue: '' };
  handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return inputValue;
  };
  render() {
    return (
      <AsyncSelect cacheOptions defaultOptions loadOptions={promiseOptions} />
    );
  }
}
