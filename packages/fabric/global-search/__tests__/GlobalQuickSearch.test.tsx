import { mount } from 'enzyme';
import * as React from 'react';
import GlobalQuickSearch, { Props } from '../src/components/GlobalQuickSearch';
import { AkQuickSearch } from '@atlaskit/navigation';

const noop = () => {};

function render(partialProps: Partial<Props>) {
  const props: Props = {
    onSearch: noop,
    getRecentlyViewedItems: noop,
    isLoading: false,
    query: '',
    recentlyViewedItems: [],
    recentResults: [],
    jiraResults: [],
    confluenceResults: [],
    peopleResults: [],
    ...partialProps,
  };

  return mount<Props>(<GlobalQuickSearch {...props} />);
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
      .find(AkQuickSearch)
      .prop('onSearchInput');
    onSearchInput({ target: { value: 'foo' } });

    expect(searchMock).toHaveBeenCalledWith('foo');
  });
});
