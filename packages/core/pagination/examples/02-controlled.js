// @flow

import React, { Component, Fragment } from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Pagination from '../src';

type State = {
  value: number,
};

export default class extends Component<{}, State> {
  state = {
    value: 6,
  };

  updateValueTo = (newValue: number) => {
    this.setState({
      value: newValue,
    });
  };

  controllingComponent = (value: number) => (
    <ButtonGroup>
      <Button
        isDisabled={value === 1}
        onClick={() => this.updateValueTo(value - 1)}
      >
        Previous Page
      </Button>
      <Button
        isDisabled={value === 10}
        onClick={() => this.updateValueTo(value + 1)}
      >
        Next Page
      </Button>
      <Button isDisabled apprearence="subtle">
        Current Page: {value}
      </Button>
    </ButtonGroup>
  );

  render() {
    const { value } = this.state;
    return (
      <Fragment>
        <h3>Controlling Component</h3>
        <hr />
        {this.controllingComponent(value)}
        <h3>Controlled Pagination</h3>
        <hr />
        <Pagination
          value={this.state.value}
          total={10}
          onChange={page => console.log(page)}
        />
      </Fragment>
    );
  }
}
