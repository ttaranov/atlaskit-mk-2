// @flow
import React, { Component } from 'react';
import MultiSelect from '@atlaskit/multi-select';
import Group from '@atlaskit/tag-group';
import Tag from '@atlaskit/tag';
import InlineEditor from '../src';

const MultiSelectItems: Array<any> = [
  { content: 'Apple', value: 'Apple' },
  { content: 'Banana', value: 'Banana' },
  { content: 'Cherry', value: 'Cherry' },
  { content: 'Mango', value: 'Mango' },
  { content: 'Orange', value: 'Orange' },
  { content: 'Strawberry', value: 'Strawberry' },
  { content: 'Watermelon', value: 'Watermelon' },
];

type State = {
  onEventResult: string,
  editValue: string | number,
};

export default class SelectExample extends Component<void, State> {
  state = {
    onEventResult: 'Click on a field above to show edit view',
    editValue: '',
  };

  onConfirm = (event: any) => {
    this.setState({
      onEventResult: `onConfirm called`,
      editValue: event.target.value,
    });
  };

  onCancel = (event: any) => {
    this.setState({
      onEventResult: `onCancel called`,
      editValue: event.target.value,
    });
  };

  renderEditView = () => (
    <MultiSelect
      defaultSelected={MultiSelectItems}
      items={MultiSelectItems}
      isDefaultOpen
      shouldFitContainer
      shouldFocus
    />
  );

  renderReadView = () => (
    <Group>
      <Tag text="Apple" />
      <Tag text="Banana" />
      <Tag text="Cherry" />
      <Tag text="Mango" />
      <Tag text="Orange" />
      <Tag text="Strawberry" />
      <Tag text="Watermelon" />
    </Group>
  );

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEditor
          label="With Multi Select Edit View"
          disableEditViewFieldBase
          editView={this.renderEditView()}
          readView={this.renderReadView()}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
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
          {this.state.onEventResult}
        </div>
      </div>
    );
  }
}
