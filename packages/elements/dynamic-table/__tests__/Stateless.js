// @flow
import React from 'react';
import { shallow } from 'enzyme';
import StatelessDynamicTable from '../src/components/Stateless';
import TableHead from '../src/components/TableHead';
import { head, rowsWithKeys, sortKey, secondSortKey } from './_data';

describe('Stateless dynamic table', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      head,
      rows: rowsWithKeys,
      sortKey,
      sortOrder: "ASC",
      onSort: jest.fn(),
    }
  });

  const simulateOnSort = (wrapper) => {
    const tableHead = wrapper.find(TableHead);
    const item = { key: sortKey };
    tableHead.prop('onSort')(item)();
    return item;
  }

  it('onSort should change to ASC from DESC if table is not rankable', () => {
    const wrapper = shallow(<StatelessDynamicTable 
      {...defaultProps}
      sortOrder="DESC"
    />);

    const item = simulateOnSort(wrapper);
    expect(defaultProps.onSort).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSort).toHaveBeenLastCalledWith({
      key: sortKey,
      item,
      sortOrder: "ASC"
    });
  });

  it('onSort should change to none if table is rankable and sort order was DESC', () => {
    const wrapper = shallow(<StatelessDynamicTable 
      {...defaultProps}
      sortOrder="DESC"
      isRankable
    />);

    const item = simulateOnSort(wrapper);
    expect(defaultProps.onSort).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSort).toHaveBeenLastCalledWith({
      key: null,
      item,
      sortOrder: null
    });
  });

  it('onSort should change to DESC if table is rankable and sort order was ACS', () => {
    const wrapper = shallow(<StatelessDynamicTable 
        {...defaultProps}
        sortOrder="ASC"
        isRankable
    />);

    const item = simulateOnSort(wrapper);
    expect(defaultProps.onSort).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSort).toHaveBeenLastCalledWith({
      key: sortKey,
      item,
      sortOrder: 'DESC'
    });
  });

  it('onSort should change to ASC if table is rankable was sorted on different row', () => {
    const wrapper = shallow(<StatelessDynamicTable 
        {...defaultProps}
        sortOrder="DESC"
        sortKey={secondSortKey}
        isRankable
    />);

    const item = simulateOnSort(wrapper);
    expect(defaultProps.onSort).toHaveBeenCalledTimes(1);
    expect(defaultProps.onSort).toHaveBeenLastCalledWith({
      key: sortKey,
      item,
      sortOrder: 'ASC'
    });
  });
});
