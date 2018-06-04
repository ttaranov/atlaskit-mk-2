// @flow
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select, { components } from '@atlaskit/select';
import SingleSelect from '@atlaskit/single-select';
import InlineDialog from '../src';

const Option = ({ innerProps }) => {
  const onClick = event => newValue => {
    console.log('Option clicked');
    event.preventDefault();
    innerProps.onClick(newValue);
  };

  return <components.Option {...innerProps} onClick={onClick} />;
};

type State = {
  isDialogOpen: boolean,
  isSelectOpen: boolean,
};

export default class SingleSelectDialog extends Component<{}, State> {
  state = {
    isDialogOpen: true,
    isSelectOpen: true,
  };

  dialogClosed = () => {
    if (this.state.isSelectOpen) {
      this.setState(prevState => ({ isDialogOpen: !prevState.isDialogOpen }));
      console.log('Close');
    }
  };

  selectClickHandler = (event: Event) => {
    console.log(`Select Click ${event}`);
  };

  selectOnChangeHandler = () => {
    this.setState({ isSelectOpen: false });
  };

  render() {
    const options = [
      {
        label: 'value 1',
        value: 1,
      },
      {
        label: 'value 2',
        value: 2,
      },
    ];

    const optionInnerProps = {
      onClick: this.selectClickHandler,
      id: 'test',
    };

    const content = (
      <div style={{ width: '300px' }}>
        <h1>Using Select</h1>
        <Select
          options={options}
          onChange={this.selectOnChangeHandler}
          menuIsOpen
          components={<Option innerProps={{ ...optionInnerProps }} />}
        />
        <h1>Using Old Select</h1>
        <SingleSelect
          items={[
            {
              items: [
                {
                  value: 'selectItem',
                  content: 'selectItem',
                },
              ],
            },
          ]}
        />
      </div>
    );

    return (
      <InlineDialog
        content={content}
        isOpen={this.state.isDialogOpen}
        onClose={this.dialogClosed}
      />
    );
  }
}
