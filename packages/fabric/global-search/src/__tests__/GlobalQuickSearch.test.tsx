import { mount } from 'enzyme';
import * as React from 'react';
import GlobalQuickSearch, { Props } from '../components/GlobalQuickSearch';
import { AkQuickSearch } from '@atlaskit/navigation';

function noop() {}

function render(partialProps: Partial<Props>) {
  const props: Props = {
    search: noop,
    getRecentlyViewedItems: noop,
    isLoading: false,
    query: '',
    recentlyViewedItems: [],
    recentResults: [],
    jiraResults: [],
    confluenceResults: [],
    ...partialProps,
  };

  return mount(<GlobalQuickSearch {...props} />);
}

describe('GlobalQuickSearch', () => {
  it('should get recent items on mount', () => {
    const getRecentlyViewedItemsMock = jest.fn();
    render({ getRecentlyViewedItems: getRecentlyViewedItemsMock });

    expect(getRecentlyViewedItemsMock).toHaveBeenCalled();
  });

  it('should handle search input', () => {
    const searchMock = jest.fn();
    const wrapper = render({ search: searchMock });

    const onSearchInput: any = wrapper
      .find(AkQuickSearch)
      .prop('onSearchInput');
    onSearchInput({ target: { value: 'foo' } });

    expect(searchMock).toHaveBeenCalledWith('foo');
  });
});
