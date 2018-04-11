import { shallow } from 'enzyme';
import * as React from 'react';
import GlobalQuickSearch, { Props } from '../src/components/GlobalQuickSearch';
import { QuickSearch } from '@atlaskit/quick-search';

const noop = () => {};

function render(partialProps: Partial<Props>) {
  const props: Props = {
    onSearch: noop,
    getRecentlyViewedItems: noop,
    isLoading: false,
    isError: false,
    query: '',
    recentlyViewedItems: [],
    recentResults: [],
    jiraResults: [],
    confluenceResults: [],
    peopleResults: [],
    ...partialProps,
  };

  return shallow<Props>(<GlobalQuickSearch {...props} />);
}

describe('GlobalQuickSearch', () => {
  it('should get recent items on mount', () => {
    const getRecentlyViewedItemsMock = jest.fn();
    render({ getRecentlyViewedItems: getRecentlyViewedItemsMock });

    expect(getRecentlyViewedItemsMock).toHaveBeenCalled();
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

  it('should retry the search with current query', () => {
    const searchMock = jest.fn();
    const wrapper = render({
      onSearch: searchMock,
      query: 'macbook',
    });

    (wrapper.instance() as GlobalQuickSearch).retrySearch();

    expect(searchMock).toHaveBeenCalledWith('macbook');
  });
});
