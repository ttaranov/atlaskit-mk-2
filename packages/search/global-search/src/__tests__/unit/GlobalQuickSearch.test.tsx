import { shallow } from 'enzyme';
import * as React from 'react';
import GlobalQuickSearchWithAnalytics, {
  GlobalQuickSearch,
  Props,
} from '../../components/GlobalQuickSearch';
import { QuickSearch } from '@atlaskit/quick-search';

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

  return shallow<Props>(<GlobalQuickSearch {...props} />);
}

describe('GlobalQuickSearch', () => {
  describe('GlobalQuickSearchWithAnalytics', () => {
    it('should render GlobalQuickSearch with a createAnalyticsEvent prop', () => {
      const wrapper = shallow(
        <GlobalQuickSearchWithAnalytics {...DEFAULT_PROPS} />,
      ).dive();
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
