import * as React from 'react';
import GlobalQuickSearchWithAnalytics, {
  GlobalQuickSearch,
  Props,
} from '../../components/GlobalQuickSearch';
import { QuickSearch } from '@atlaskit/quick-search';
import {
  shallowWithIntl,
  mountWithIntl,
} from './helpers/_intl-enzyme-test-helper';

const noop = () => {};
const DEFAULT_PROPS = {
  onSearch: noop,
  onMount: noop,
  isLoading: false,
  searchSessionId: 'abc',
  query: '',
  children: [],
};

function render(partialProps: Partial<Props>) {
  const props: Props = {
    ...DEFAULT_PROPS,
    ...partialProps,
  };

  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<GlobalQuickSearch {...props} />);
}

describe('GlobalQuickSearch', () => {
  describe('GlobalQuickSearchWithAnalytics', () => {
    it('should render GlobalQuickSearch with a createAnalyticsEvent prop', () => {
      const wrapper = mountWithIntl(
        <GlobalQuickSearchWithAnalytics {...DEFAULT_PROPS} />,
      );
      expect(
        wrapper.find(GlobalQuickSearch).prop('createAnalyticsEvent'),
      ).toBeDefined();
    });
  });

  it('should call onMount on mount, duh', () => {
    const onMountMock = jest.fn();
    render({ onMount: onMountMock });
    expect(onMountMock).toHaveBeenCalled();
  });

  it('should handle search input', () => {
    const searchMock = jest.fn();
    const wrapper = render({ onSearch: searchMock });

    const onSearchInput: Function = wrapper
      .find(QuickSearch)
      .prop('onSearchInput');
    onSearchInput({ target: { value: 'foo' } });

    expect(searchMock).toHaveBeenCalledWith('foo');
  });
});
