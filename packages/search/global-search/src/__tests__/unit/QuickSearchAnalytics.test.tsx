import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { setupMocks, teardownMocks } from '../../../example-helpers/mockApis';
import { GlobalQuickSearch } from '../..';
import { QuickSearchContainer } from '../../components/common/QuickSearchContainer';
import BasicNavigation from '../../../example-helpers/BasicNavigation';
import LocaleIntlProvider from '../../../example-helpers/LocaleIntlProvider';

import { mount, ReactWrapper } from 'enzyme';
import { waitUntil } from './_test-util';
import {
  validateEvent,
  getGlobalSearchDrawerEvent,
  getPreQuerySearchResultsEvent,
  getPostQuerySearchResultsEvent,
  getTextEnteredEvent,
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

  beforeAll(async () => {
    setupMocks({
      quickNavDelay: 0,
      crossProductSearchDelay: 0,
    });
    wrapper = await renderAndWaitForUpdate();
  });

  afterAll(() => {
    teardownMocks();
  });

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

  it('should be trigger dismissed event', () => {
    wrapper.unmount();
    expect(onEventSpy).toHaveBeenCalledTimes(1);
    const dismissedEvent = onEventSpy.mock.calls[0][0];
    validateEvent(dismissedEvent, getDismissedEvent());
  });
});
