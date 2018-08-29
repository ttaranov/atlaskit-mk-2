import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { setupMocks, teardownMocks } from '../../../example-helpers/mockApis';
import { GlobalQuickSearch } from '../..';
import { QuickSearchContainer } from '../../components/common/QuickSearchContainer';
import BasicNavigation from '../../../example-helpers/BasicNavigation';
import LocaleIntlProvider from '../../../example-helpers/LocaleIntlProvider';
import { ResultBase } from '@atlaskit/quick-search';

import { mount, ReactWrapper } from 'enzyme';
import { waitUntil } from './_test-util';
import {
  validateEvent,
  getGlobalSearchDrawerEvent,
  getPreQuerySearchResultsEvent,
  getPostQuerySearchResultsEvent,
  getTextEnteredEvent,
  getAdvancedSearchLinkSelectedEvent,
  getResultSelectedEvent,
  getHighlightEvent,
  getDismissedEvent,
} from './helpers/_events_payloads';

const spyOnComponentDidUpdate = () => {
  if (QuickSearchContainer.prototype.componentDidUpdate) {
    return jest.spyOn(QuickSearchContainer.prototype, 'componentDidUpdate');
  }
  const spy = jest.fn();
  QuickSearchContainer.prototype.componentDidUpdate = spy;
  return spy;
};

const CONFLUECE_RECENT_ITEMS = [
  {
    id: 'confluence-object-result',
    hasContainerId: true,
    resultsCount: 8,
  },
  {
    id: 'generic-container-result',
    hasContainerId: false,
    resultsCount: 3,
  },
  {
    id: 'person-result',
    hasContainerId: false,
    resultsCount: 3,
  },
];
describe('Quick Search Analytics', () => {
  const updateSpy = spyOnComponentDidUpdate();
  const onEventSpy = jest.fn();
  let wrapper: ReactWrapper;
  let originalWindowAssign = window.location.assign;

  beforeAll(async () => {
    window.location.assign = jest.fn();
    setupMocks({
      quickNavDelay: 0,
      crossProductSearchDelay: 0,
    });
    wrapper = await renderAndWaitForUpdate();
  });

  afterAll(() => {
    window.location.assign = originalWindowAssign;
    teardownMocks();
  });

  const inputFocus = (focus = true) => {
    const input = wrapper.find('input');
    expect(input.length).toBe(1);
    input.simulate(focus ? 'focus' : 'blur');
  };

  const inputBlur = () => {
    inputFocus(false);
  };

  const renderComponent = onEvent => {
    return mount(
      <AnalyticsListener onEvent={onEvent} channel="fabric-elements">
        <BasicNavigation
          searchDrawerContent={
            <LocaleIntlProvider locale="en">
              <GlobalQuickSearch
                cloudId="cloudId"
                context="confluence"
                referralContextIdentifiers={{
                  currentContentId: '123',
                  searchReferrerId: '123',
                }}
                {...this.props}
              />
            </LocaleIntlProvider>
          }
        />
      </AnalyticsListener>,
    );
  };

  const renderAndWaitForUpdate = async () => {
    const wrapper = renderComponent(onEventSpy);
    const container = wrapper.find(QuickSearchContainer);
    expect(container.length).toBe(1);
    await waitUntil(() => updateSpy.mock.calls.length > 0, 1000);
    return wrapper;
  };

  describe('Initial events', () => {
    afterAll(() => {
      updateSpy.mockReset();
      onEventSpy.mockReset();
    });

    it('should trigger globalSearchDrawer', async () => {
      expect(onEventSpy).toBeCalled();
      const event = onEventSpy.mock.calls[0][0];
      validateEvent(
        event,
        getGlobalSearchDrawerEvent({
          subscreen: 'GlobalSearchPreQueryDrawer',
          timesViewed: 1,
        }),
      );
    });

    it('should trigger show prequery results event ', () => {
      expect(onEventSpy).toBeCalled();
      const event = onEventSpy.mock.calls[1][0];
      validateEvent(
        event,
        getPreQuerySearchResultsEvent(CONFLUECE_RECENT_ITEMS),
      );
    });
  });

  describe('Highlight and select', () => {
    afterEach(() => {
      updateSpy.mockReset();
      onEventSpy.mockReset();
      inputBlur();
    });

    const keyPress = (key: 'ArrowUp' | 'ArrowDown' | 'Enter', withShift?) => {
      const input = wrapper.find('input');
      expect(input.length).toBe(1);
      input.simulate('keyDown', {
        key,
        shiftKey: withShift,
      });
    };

    it('should trigger highlight result event', () => {
      const count = 9;
      for (let i = 0; i < count; i++) {
        keyPress('ArrowDown');
      }
      expect(onEventSpy).toHaveBeenCalledTimes(count);
      onEventSpy.mock.calls.forEach(([event], index) => {
        validateEvent(
          event,
          getHighlightEvent({
            key: 'ArrowDown',
            indexWithinSection: index % (count - 1),
            globalIndex: index,
            resultCount: 16, // 14 + 2 advanced
            sectionIndex: Math.floor(index / (count - 1)),
            sectionId: 'recent-confluence',
            type: index === 8 ? undefined : 'confluence-page',
          }),
        );
      });
    });

    it('should trigger highlight result event on arrow up', () => {
      keyPress('ArrowUp');
      expect(onEventSpy).toHaveBeenCalledTimes(1);
      const event = onEventSpy.mock.calls[0][0];
      validateEvent(
        event,
        getHighlightEvent({
          key: 'ArrowUp',
          indexWithinSection: undefined,
          globalIndex: 15,
          resultCount: 16, // 14 + 2 advanced
          sectionIndex: undefined, // advanced results is not a section
          sectionId: 'advanced-search-confluence',
          type: undefined,
        }),
      );
    });

    it('should trigger advanced result selected', () => {
      const results = wrapper.find(ResultBase);
      expect(results.length).toBe(16);
      const advancedSearchResult = results.last();
      advancedSearchResult.simulate('click', {
        metaKey: true,
      });
      expect(onEventSpy).toHaveBeenCalledTimes(1);
      const event = onEventSpy.mock.calls[0][0];
      validateEvent(
        event,
        getAdvancedSearchLinkSelectedEvent({
          resultContentId: 'search_confluence',
          sectionId: 'advanced-search-confluence',
          globalIndex: 15,
          resultCount: 14, // does not include advanced search links
        }),
      );
    });

    it('should trigger result selected', () => {
      const results = wrapper.find(ResultBase);
      expect(results.length).toBe(16);
      const result = results.at(10);
      result.simulate('click', {
        metaKey: true,
      });

      expect(onEventSpy).toHaveBeenCalledTimes(1);
      const event = onEventSpy.mock.calls[0][0];
      validateEvent(
        event,
        getResultSelectedEvent({
          sectionId: 'recent-confluence',
          globalIndex: 10,
          resultCount: 14, // does not include advanced search links
          sectionIndex: 1,
          indexWithinSection: 2,
          trigger: 'click',
          newTab: true,
          type: undefined,
        }),
      );
    });

    it('should trigger result selected via keyboard navigation', () => {
      keyPress('ArrowDown');
      keyPress('ArrowDown');
      keyPress('Enter');
      expect(onEventSpy).toHaveBeenCalled();
      const event = onEventSpy.mock.calls[onEventSpy.mock.calls.length - 1][0];
      validateEvent(
        event,
        getResultSelectedEvent({
          sectionId: 'recent-confluence',
          globalIndex: 1,
          resultCount: 16, // include advanced search links
          sectionIndex: 0,
          indexWithinSection: 1,
          trigger: 'returnKey',
          newTab: false,
          type: 'confluence-page',
        }),
      );
    });
  });

  [
    {
      query: 'Robust',
      expectedResults: {
        textEnteredEvent: {
          queryLength: 6,
          queryVersion: 0,
          wordCount: 1,
        },
        postQueryResults: [
          {
            id: 'confluence-object-result',
            hasContainerId: true,
            resultsCount: 8,
          },
        ],
      },
    },
    {
      query: 'No Result',
      expectedResults: {
        textEnteredEvent: {
          queryLength: 9,
          queryVersion: 2,
          wordCount: 2,
        },
        postQueryResults: [],
      },
    },
  ].forEach(({ query, expectedResults }, index) => {
    describe(`Search query=${query}`, () => {
      const writeQuery = (query: string) => {
        const input = wrapper.find('input');
        expect(input.length).toBe(1);
        input.simulate('input', {
          target: {
            value: query,
          },
        });
      };

      beforeAll(async () => {
        writeQuery(query);
        await waitUntil(() => updateSpy.mock.calls.length === 2, 1000);
      });

      it('should trigger entered text event', () => {
        const textEnteredEvent = onEventSpy.mock.calls[0][0];
        validateEvent(
          textEnteredEvent,
          getTextEnteredEvent(expectedResults.textEnteredEvent),
        );
      });

      it('should trigger postquery drawer view event', () => {
        const event = onEventSpy.mock.calls[1][0];
        validateEvent(
          event,
          getGlobalSearchDrawerEvent({
            subscreen: 'GlobalSearchPostQueryDrawer',
            timesViewed: 1 + index,
          }),
        );
      });

      it('should trigger post query search results event', () => {
        const event = onEventSpy.mock.calls[2][0];
        validateEvent(
          event,
          getPostQuerySearchResultsEvent(expectedResults.postQueryResults),
        );
      });

      describe('Clear Query', () => {
        beforeAll(async () => {
          updateSpy.mockReset();
          onEventSpy.mockReset();
          writeQuery('');
          await waitUntil(() => updateSpy.mock.calls.length === 1, 1000);
        });

        afterAll(() => {
          updateSpy.mockReset();
          onEventSpy.mockReset();
        });

        it('should trigger entered text event', () => {
          const textEnteredEvent = onEventSpy.mock.calls[0][0];
          validateEvent(
            textEnteredEvent,
            getTextEnteredEvent({
              queryLength: 0,
              queryVersion: 1 + index * 2,
              wordCount: 0,
            }),
          );
        });

        it('should trigger prequery drawer view event', () => {
          const event = onEventSpy.mock.calls[1][0];
          validateEvent(
            event,
            getGlobalSearchDrawerEvent({
              subscreen: 'GlobalSearchPreQueryDrawer',
              timesViewed: 2 + index,
            }),
          );
        });

        it('should trigger show prequery results event ', () => {
          expect(onEventSpy).toBeCalled();
          const event = onEventSpy.mock.calls[2][0];
          validateEvent(
            event,
            getPreQuerySearchResultsEvent(CONFLUECE_RECENT_ITEMS),
          );
        });
      });
    });
  });

  describe('Dismissed Event', () => {
    it('should not trigger dismissed Event when result is selected', () => {
      wrapper.unmount();
      expect(onEventSpy).not.toHaveBeenCalled();
    });

    it('should be trigger dismissed event', () => {
      // remount
      wrapper.mount();
      wrapper.unmount();
      expect(onEventSpy).toHaveBeenCalledTimes(1);
      const dismissedEvent = onEventSpy.mock.calls[0][0];
      validateEvent(dismissedEvent, getDismissedEvent());
    });
  });
});
