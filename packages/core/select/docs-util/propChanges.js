// @flow
import React, { Component, Fragment, type Node } from 'react';
import { md } from '@atlaskit/docs';
import { CheckboxSelect, RadioSelect } from '../src';
import PropStatus from './propStatus';

const allOptions = [
  { value: 'removed', label: 'removed' },
  { value: 'unchanged', label: 'unchanged' },
  { value: 'renamed', label: 'renamed' },
  { value: 'changed', label: 'changed' },
];

const filterOptions = [
  { value: 'propName', label: 'propName' },
  { value: 'status', label: 'status' },
];

const Header = ({ children }: { children: Node }) => (
  <td
    css={{
      fontWeight: 'bold',
      padding: '4px 8px 4px 0',
      borderBottom: '3px solid #eee',
    }}
  >
    {children}
  </td>
);

const Table = ({ children }: { children: Node }) => (
  <table
    css={{
      width: '100%',
      marginTop: '30px',
      borderCollapse: 'collapse',
    }}
  >
    {children}
  </table>
);

const getDisplayedStatus = status => {
  if (status === 'components' || status === 'styles') return 'removed';
  return status;
};

type Prop = { data: Array<Array<string>> };

type State = {
  selectedOptions: Array<string>,
  filterValue: string,
};

export default class PropChanges extends Component<Prop, State> {
  state = {
    selectedOptions: allOptions.map(opt => opt.value),
    filterValue: filterOptions[0].value,
  };
  onFilterChange = (option: Array<*>) => {
    this.setState({ selectedOptions: option.map(opt => opt.value) });
  };
  onSortChange = (option: { value: string, label: string }) => {
    this.setState({ filterValue: option.value });
  };
  render() {
    const { data } = this.props;
    const { selectedOptions, filterValue } = this.state;
    return (
      <Fragment>
        <h4> Filter Props </h4>
        <CheckboxSelect
          defaultValue={allOptions}
          options={allOptions}
          onChange={this.onFilterChange}
        />
        <h4> Sort Props </h4>
        <RadioSelect
          defaultValue={filterOptions[0]}
          options={filterOptions}
          onChange={this.onSortChange}
        />
        <Table>
          <thead>
            <tr>
              <Header>Prop</Header>
              <Header>Status</Header>
              <Header>Notes</Header>
            </tr>
          </thead>
          {data
            .sort((a, b) => {
              if (filterValue === 'propName') return a[0].localeCompare(b[0]);
              return getDisplayedStatus(a[1]).localeCompare(
                getDisplayedStatus(b[1]),
              );
            })
            .map(entry => {
              const [prop, status, note] = entry;
              return selectedOptions.includes(getDisplayedStatus(status)) ? (
                <PropStatus
                  key={prop}
                  prop={prop}
                  status={status}
                  note={note}
                />
              ) : null;
            })}
        </Table>
      </Fragment>
    );
  }
}
