import * as React from 'react';
import { shallow, mount } from 'enzyme';
import GlobalQuickSearchWithAnalytics, {
  GlobalQuickSearch,
  Props,
} from '../../components/GlobalQuickSearch';
import * as AnalyticsHelper from '../../util/analytics-event-helper';

const noop = () => {};
const DEFAULT_PROPS = {
  onSearch: noop,
  onMount: noop,
  isLoading: false,
  searchSessionId: 'abc',
  children: [],
};

function render(partialProps: Partial<Props>) {
  const props: Props = {
    ...DEFAULT_PROPS,
    ...partialProps,
  };

  return shallow(<GlobalQuickSearch {...props} />);
}

describe('GlobalQuickSearch', () => {
  describe('GlobalQuickSearchWithAnalytics', () => {
    it('should render GlobalQuickSearch with a createAnalyticsEvent prop', () => {
      const wrapper = mount(
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
      .children()
      .first()
      .prop('onSearchInput');
    onSearchInput({ target: { value: 'foo' } });

    expect(searchMock).toHaveBeenCalledWith('foo');
  });

  it('should trim the search input', () => {
    const searchMock = jest.fn();
    const wrapper = render({ onSearch: searchMock });

    const onSearchInput: Function = wrapper
      .children()
      .first()
      .prop('onSearchInput');
    onSearchInput({ target: { value: '  pattio   ' } });

    expect(searchMock).toHaveBeenCalledWith('pattio');
  });

  describe('Search result events', () => {
    const searchSessionId = 'random-session-id';
    let fireHighlightEventSpy;
    let fireSearchResultSelectedEventSpy;
    let fireAdvancedSearchSelectedEventSpy;
    beforeEach(() => {
      fireHighlightEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireHighlightedSearchResult',
      );
      fireSearchResultSelectedEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireSelectedSearchResult',
      );
      fireAdvancedSearchSelectedEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireSelectedAdvancedSearch',
      );
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    const deepRender = (): Function =>
      render({ searchSessionId })
        .dive()
        .prop('firePrivateAnalyticsEvent');

    ['ArrowUp', 'ArrowDown'].forEach(key => {
      it('should trigger highlight event', () => {
        const firePrivateAnalyticsEvent = deepRender();
        const eventData = {
          resultId: 'result-id',
          type: 'recent-result',
          contentType: 'confluence-page',
          sectionIndex: 2,
          index: 11,
          indexWithinSection: 2,
          key,
        };
        // call
        firePrivateAnalyticsEvent(
          'atlaskit.navigation.quick-search.keyboard-controls-used',
          eventData,
        );

        // asserts
        expect(fireHighlightEventSpy.mock.calls.length).toBe(1);
        expect(fireHighlightEventSpy.mock.calls[0][0]).toMatchObject(eventData);
        expect(fireHighlightEventSpy.mock.calls[0][1]).toBe(searchSessionId);

        // verify other spies are not called
        [
          fireAdvancedSearchSelectedEventSpy,
          fireSearchResultSelectedEventSpy,
        ].forEach(spy => expect(spy.mock.calls.length).toBe(0));
      });
    });

    it('should not fire highlight event on enter', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'result-id',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        key: 'Enter',
      };
      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.keyboard-controls-used',
        eventData,
      );

      // verify
      [
        fireAdvancedSearchSelectedEventSpy,
        fireSearchResultSelectedEventSpy,
        fireHighlightEventSpy,
      ].forEach(spy => expect(spy.mock.calls.length).toBe(0));
    });

    it('should fire selected search event', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'result-id',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        method: 'click',
        newTab: false,
      };

      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.submit',
        eventData,
      );

      // assert
      expect(fireSearchResultSelectedEventSpy.mock.calls.length).toBe(1);
      expect(fireSearchResultSelectedEventSpy.mock.calls[0][0]).toMatchObject(
        eventData,
      );
      expect(fireSearchResultSelectedEventSpy.mock.calls[0][1]).toBe(
        searchSessionId,
      );

      // verify
      [fireAdvancedSearchSelectedEventSpy, fireHighlightEventSpy].forEach(spy =>
        expect(spy.mock.calls.length).toBe(0),
      );
    });

    it('should fire advanced search event', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'search_confluence',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        method: 'click',
        newTab: false,
      };

      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.submit',
        eventData,
      );

      // assert
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls.length).toBe(1);
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls[0][0]).toMatchObject(
        eventData,
      );
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls[0][1]).toBe(
        searchSessionId,
      );

      // verify
      [fireSearchResultSelectedEventSpy, fireHighlightEventSpy].forEach(spy =>
        expect(spy.mock.calls.length).toBe(0),
      );
    });
  });
});
