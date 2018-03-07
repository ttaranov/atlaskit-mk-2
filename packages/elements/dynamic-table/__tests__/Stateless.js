// @flow
import React from 'react';
import { shallow, mount } from 'enzyme';
import {
  AnalyticsListener,
  AnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';
import DynamicTableWithAnalytics, {
  DynamicTable,
} from '../src/components/Stateless';
import TableHead from '../src/components/TableHead';
import { head, rowsWithKeys, sortKey, secondSortKey } from './_data';

const simulateOnSort = wrapper => {
  const tableHead = wrapper.find(TableHead);
  const item = { key: sortKey };
  tableHead.prop('onSort')(item)();
  return item;
};

const createProps = () => ({
  head,
  rows: rowsWithKeys,
  sortKey,
  sortOrder: 'ASC',
  onSort: jest.fn(),
});

test('onSort should change to ASC from DESC if table is not rankable', () => {
  const props = createProps();
  const wrapper = shallow(<DynamicTable {...props} sortOrder="DESC" />);

  const item = simulateOnSort(wrapper);
  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'ASC',
  });
});

test('onSort should change to none if table is rankable and sort order was DESC', () => {
  const props = createProps();
  const wrapper = shallow(
    <DynamicTable {...props} sortOrder="DESC" isRankable />,
  );

  const item = simulateOnSort(wrapper);
  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: null,
    item,
    sortOrder: null,
  });
});

test('onSort should change to DESC if table is rankable and sort order was ASC', () => {
  const props = createProps();
  const wrapper = shallow(
    <DynamicTable {...props} sortOrder="ASC" isRankable />,
  );

  const item = simulateOnSort(wrapper);
  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'DESC',
  });
});

test('onSort should change to ASC if table is rankable and was sorted using on different row', () => {
  const props = createProps();
  const wrapper = shallow(
    <DynamicTable
      {...props}
      sortOrder="DESC"
      sortKey={secondSortKey}
      isRankable
    />,
  );

  const item = simulateOnSort(wrapper);
  expect(props.onSort).toHaveBeenCalledTimes(1);
  expect(props.onSort).toHaveBeenLastCalledWith({
    key: sortKey,
    item,
    sortOrder: 'ASC',
  });
});
describe('analytics - DynamicTable', () => {
  it('should provide analytics context with component, package and version fields', () => {
    const wrapper = shallow(<DynamicTableWithAnalytics />);

    expect(wrapper.find(AnalyticsContext).prop('data')).toEqual({
      component: 'dynamic-table',
      package: packageName,
      version: packageVersion,
    });
  });

  it('should pass analytics event as last argument to onSetPage handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<DynamicTableWithAnalytics onSetPage={spy} />);
    wrapper.find('button').simulate('setPage');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'setPage',
      }),
    );
  });

  it('should pass analytics event as last argument to onSort handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<DynamicTableWithAnalytics onSort={spy} />);
    wrapper.find('button').simulate('sort');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'sort',
      }),
    );
  });

  it('should pass analytics event as last argument to onRankStart handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<DynamicTableWithAnalytics onRankStart={spy} />);
    wrapper.find('button').simulate('rankStart');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'rankStart',
      }),
    );
  });

  it('should pass analytics event as last argument to onRankEnd handler', () => {
    const spy = jest.fn();
    const wrapper = mount(<DynamicTableWithAnalytics onRankEnd={spy} />);
    wrapper.find('button').simulate('rankEnd');

    const analyticsEvent = spy.mock.calls[0][1];
    expect(analyticsEvent).toEqual(expect.any(UIAnalyticsEvent));
    expect(analyticsEvent.payload).toEqual(
      expect.objectContaining({
        action: 'rankEnd',
      }),
    );
  });

  it('should fire an atlaskit analytics event on setPage', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <DynamicTableWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(DynamicTableWithAnalytics).simulate('setPage');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'setPage' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'dynamic-table',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on sort', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <DynamicTableWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(DynamicTableWithAnalytics).simulate('sort');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'sort' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'dynamic-table',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on rankStart', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <DynamicTableWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(DynamicTableWithAnalytics).simulate('rankStart');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'rankStart' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'dynamic-table',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });

  it('should fire an atlaskit analytics event on rankEnd', () => {
    const spy = jest.fn();
    const wrapper = mount(
      <AnalyticsListener onEvent={spy} channel="atlaskit">
        <DynamicTableWithAnalytics />
      </AnalyticsListener>,
    );

    wrapper.find(DynamicTableWithAnalytics).simulate('rankEnd');
    const [analyticsEvent, channel] = spy.mock.calls[0];

    expect(channel).toBe('atlaskit');
    expect(analyticsEvent.payload).toEqual({ action: 'rankEnd' });
    expect(analyticsEvent.context).toEqual([
      {
        component: 'dynamic-table',
        package: packageName,
        version: packageVersion,
      },
    ]);
  });
});
