// @flow
import React, { Component } from 'react';
import SingleLineTextInput from '@atlaskit/input';
import { InlineEditStateless } from '../src';

type State = {|
  value: string | number,
  isEditing: boolean,
|};

export default class StatelessExample extends Component<void, State> {
  state = {
    value: '',
    isEditing: false,
  };

  render() {
    return (
      <div>
        <InlineEditStateless
          label="Stateless Inline Edit"
          isEditing={this.state.isEditing}
          onEditRequested={() => this.setState({ isEditing: true })}
          onCancel={() => this.setState({ isEditing: false })}
          onConfirm={() => this.setState({ isEditing: false })}
          readView={
            <SingleLineTextInput
              isEditing={false}
              value={this.state.value || 'Field value'}
            />
          }
          editView={
            <SingleLineTextInput
              isEditing
              isInitiallySelected
              value={this.state.value}
              onChange={e => this.setState({ value: e.target.value })}
            />
          }
        />
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          State updated onChange with value: {this.state.value}
        </div>
      </div>
    );
  }
}
