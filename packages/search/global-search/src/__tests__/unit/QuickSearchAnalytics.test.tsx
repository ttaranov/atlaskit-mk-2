import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  setupMocks,
  teardownMocks,
  ZERO_DELAY_CONFIG,
} from '../../../example-helpers/mockApis';
import { GlobalQuickSearch, Props } from '../..';
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
  getExperimentExposureEvent,
} from './helpers/_events_payloads';

const spyOnComponentDidUpdate = () => {
  if (QuickSearchContainer.prototype.componentDidUpdate) {
    return jest.spyOn(QuickSearchContainer.prototype, 'componentDidUpdate');
  }
  const spy = jest.fn();
  QuickSearchContainer.prototype.componentDidUpdate = spy;
  return spy;
};

const CONFLUENCE_RECENT_ITEMS = [
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

const JIRA_RECENT_ITEMS = [
  {
    id: 'jira-object-result',
    hasContainerId: true,
    resultsCount: 7,
  },
  {
    id: 'jira-object-result',
    hasContainerId: false,
    resultsCount: 6,
  },
  {
    id: 'person-result',
    hasContainerId: false,
    resultsCount: 3,
  },
];

const getRecentItems = product =>
  product === 'jira' ? JIRA_RECENT_ITEMS : CONFLUENCE_RECENT_ITEMS;

['confluence', 'jira'].forEach(product => {
  describe(`${product} Quick Search Analytics`, () => {
    const updateSpy = spyOnComponentDidUpdate();
    const onEventSpy = jest.fn();
    let wrapper: ReactWrapper;
    let originalWindowAssign = window.location.assign;

    beforeAll(async () => {
      window.location.assign = jest.fn();
      setupMocks(ZERO_DELAY_CONFIG);
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
                  context={product as Props['context']}
                  referralContextIdentifiers={{
                    currentContentId: '123',
                    searchReferrerId: '123',
                  }}
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
        const event = onEventSpy.mock.calls[1][0];
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
        const event = onEventSpy.mock.calls[2][0];
        validateEvent(
          event,
          getPreQuerySearchResultsEvent(getRecentItems(product)),
        );
      });

      it('should trigger experiment exposure event', () => {
        expect(onEventSpy).toBeCalled();
        const event = onEventSpy.mock.calls[0][0];
        validateEvent(
          event,
          getExperimentExposureEvent({
            searchSessionId: expect.any(String),
            abTest: {
              experimentId: 'experiment-1',
              controlId: 'control-id',
              abTestId: 'abtest-id',
            },
          }),
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

      if (product === 'confluence') {
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
                globalIndex: index,
                indexWithinSection: index % (count - 1),
                sectionIndex: Math.floor(index / (count - 1)),
                resultCount: 16, // 14 + 2 advanced
                sectionId: 'recent-confluence',
                type: index >= 8 ? 'confluence-space' : 'confluence-page',
              }),
            );
          });
        });
      }

      if (product === 'jira') {
        it('should trigger highlight result event', () => {
          const count = 9;
          for (let i = 0; i < count; i++) {
            keyPress('ArrowDown');
          }
          expect(onEventSpy).toHaveBeenCalledTimes(count);

          // skip the first link which is advanced issue search link
          const callsWithoutFirstLink = onEventSpy.mock.calls.slice(1);
          callsWithoutFirstLink.forEach(([event], index) => {
            validateEvent(
              event,
              getHighlightEvent({
                key: 'ArrowDown',
                globalIndex: index + 1,
                indexWithinSection: index % (count - 2),
                sectionIndex: Math.floor(index / (count - 2)),
                resultCount: 18,
                sectionId: 'recent-jira',
                type: index >= 7 ? 'jira-board' : 'jira-issue',
              }),
            );
          });
        });
      }

      it('should trigger highlight result event on arrow up', () => {
        keyPress('ArrowUp');
        expect(onEventSpy).toHaveBeenCalledTimes(1);
        const event = onEventSpy.mock.calls[0][0];
        validateEvent(
          event,
          getHighlightEvent({
            key: 'ArrowUp',
            indexWithinSection: undefined,
            ...(product === 'confluence'
              ? {
                  globalIndex: 15,
                  resultCount: 16, // 14 + 2 advanced
                  sectionIndex: undefined, // advanced results is not a section
                  sectionId: 'advanced-search-confluence',
                  type: undefined,
                }
              : {
                  globalIndex: 17,
                  resultCount: 18, // 14 + 3 advanced (1 top + 2 bottom)
                  sectionIndex: undefined, // advanced results is not a section
                  sectionId: 'advanced-search-jira',
                  type: undefined,
                }),
          }),
        );
      });

      it('should trigger advanced result selected', () => {
        const results = wrapper.find(ResultBase);
        const expectedResultsCount = product === 'confluence' ? 16 : 18;
        expect(results.length).toBe(expectedResultsCount);
        const advancedSearchResult = results.last();
        advancedSearchResult.simulate('click', {
          metaKey: true,
        });
        expect(onEventSpy).toHaveBeenCalledTimes(1);
        const event = onEventSpy.mock.calls[0][0];
        const payload =
          product === 'confluence'
            ? {
                actionSubjectId: 'advanced_search_confluence',
                resultContentId: 'search_confluence',
                sectionId: 'advanced-search-confluence',
                globalIndex: 15,
                resultCount: 14, // does not include advanced search links
              }
            : {
                actionSubjectId: 'advanced_search_jira',
                resultContentId: 'search_jira',
                sectionId: 'advanced-search-jira',
                globalIndex: 17,
                resultCount: 16, // does not include advanced search links
              };
        validateEvent(event, getAdvancedSearchLinkSelectedEvent(payload));
      });

      it('should trigger result selected', () => {
        const results = wrapper.find(ResultBase);
        const expectedResultsCount = product === 'confluence' ? 16 : 18;
        expect(results.length).toBe(expectedResultsCount);
        const result = results.at(10);
        result.simulate('click', {
          metaKey: true,
        });

        expect(onEventSpy).toHaveBeenCalledTimes(1);
        const event = onEventSpy.mock.calls[0][0];
        const payload =
          product === 'confluence'
            ? {
                sectionId: 'recent-confluence',
                globalIndex: 10,
                resultCount: 14, // does not include advanced search links
                sectionIndex: 1,
                indexWithinSection: 2,
                trigger: 'click',
                newTab: true,
                type: 'confluence-space',
              }
            : {
                sectionId: 'recent-jira',
                globalIndex: 10,
                resultCount: 16, // does not include advanced search links
                sectionIndex: 1,
                indexWithinSection: 2,
                trigger: 'click',
                newTab: true,
                type: 'jira-board',
              };
        validateEvent(event, getResultSelectedEvent(payload));
      });

      it('should trigger result selected via keyboard navigation', () => {
        keyPress('ArrowDown');
        keyPress('ArrowDown');
        keyPress('Enter');
        expect(onEventSpy).toHaveBeenCalled();
        const event =
          onEventSpy.mock.calls[onEventSpy.mock.calls.length - 1][0];
        const payload =
          product === 'confluence'
            ? {
                sectionId: 'recent-confluence',
                globalIndex: 1,
                resultCount: 16, // include advanced search links
                sectionIndex: 0,
                indexWithinSection: 1,
                trigger: 'returnKey',
                newTab: false,
                type: 'confluence-page',
              }
            : {
                sectionId: 'recent-jira',
                globalIndex: 1,
                resultCount: 18, // include advanced search links
                sectionIndex: 0,
                indexWithinSection: 0,
                trigger: 'returnKey',
                newTab: false,
                type: 'jira-issue',
              };
        validateEvent(event, getResultSelectedEvent(payload));
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
          postQueryResults:
            product === 'confluence'
              ? [
                  {
                    id: 'confluence-object-result',
                    hasContainerId: true,
                    resultsCount: 8,
                  },
                ]
              : [
                  {
                    id: 'jira-object-result',
                    hasContainerId: true,
                    resultsCount: 8,
                  },
                  {
                    id: 'jira-object-result',
                    hasContainerId: true,
                    resultsCount: 6,
                  },
                ],
          postQueryResultsTimings:
            product === 'confluence'
              ? {
                  confSearchElapsedMs: expect.any(Number),
                  postQueryRequestDurationMs: expect.any(Number),
                  peopleElapsedMs: expect.any(Number),
                }
              : {
                  postQueryRequestDurationMs: expect.any(Number),
                  peopleElapsedMs: expect.any(Number),
                },
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
            getPostQuerySearchResultsEvent(
              expectedResults.postQueryResults,
              expectedResults.postQueryResultsTimings,
            ),
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
              getPreQuerySearchResultsEvent(getRecentItems(product)),
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
});
