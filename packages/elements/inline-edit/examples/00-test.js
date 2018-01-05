// @flow
import React, { PureComponent } from 'react';
import SingleLineTextInput from '@atlaskit/input';
import MultiSelect from '@atlaskit/multi-select';
import InlineEditor from '../src';

const MultiSelectItems = [
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

export default class BasicExample extends PureComponent<void, State> {
  state = {
    editValue: '',
    onEventResult:
      'Type in the InlineEditor above to trigger onComfirm and onCancel',
  };

  render() {
    return (
      <div>
        <InlineEditor
          label="Inline Edit Field"
          value="test value"
          editView={<SingleLineTextInput isEditing isInitiallySelected />}
          readView="text red view"
          onConfirm={() => {}}
          onCancel={() => console.log('cancel')}
        />

        <InlineEditor
          label="Inline Select"
          value="test value"
          editView={
            <MultiSelect
              defaultSelected={MultiSelectItems}
              items={MultiSelectItems}
              isDefaultOpen
              shouldFitContainer
              shouldFocus
            />
          }
          readView="text red view"
          onConfirm={() => {}}
          onCancel={() => console.log('cancel')}
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
        <div />
      </div>
    );
  }
}
