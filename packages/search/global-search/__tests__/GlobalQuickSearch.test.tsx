import { shallow } from 'enzyme';
import * as React from 'react';
import GlobalQuickSearch, { Props } from '../src/components/GlobalQuickSearch';
import { QuickSearch } from '@atlaskit/quick-search';

const noop = () => {};

function render(partialProps: Partial<Props>) {
  const props: Props = {
    onSearch: noop,
    onMount: noop,
    isLoading: false,
    query: '',
    children: [],
    ...partialProps,
  };

  return shallow<Props>(<GlobalQuickSearch {...props} />);
}

describe('GlobalQuickSearch', () => {
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
