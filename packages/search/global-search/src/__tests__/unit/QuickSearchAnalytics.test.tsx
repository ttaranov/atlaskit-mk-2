import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { setupMocks, teardownMocks } from '../../../example-helpers/mockApis';
import { GlobalQuickSearch } from '../..';
import { QuickSearchContainer } from '../../components/common/QuickSearchContainer';
import BasicNavigation from '../../../example-helpers/BasicNavigation';
import LocaleIntlProvider from '../../../example-helpers/LocaleIntlProvider';

import { mount } from 'enzyme';
import { waitUntil } from './_test-util';
import {
  validateEvent,
  GlobalSearchDrawerEvent,
  PreQuerySearchResultsEvent,
} from './helpers/EventsPayloads';

const spyOnComponentDidUpdate = () => {
  if (QuickSearchContainer.prototype.componentDidUpdate) {
    return jest.spyOn(QuickSearchContainer.prototype, 'componentDidUpdate');
  }
  const spy = jest.fn();
  QuickSearchContainer.prototype.componentDidUpdate = spy;
  return spy;
};

describe('Quick Search Analytics', () => {
  const updateSpy = spyOnComponentDidUpdate();
  const onEventSpy = jest.fn();

  beforeAll(async () => {
    setupMocks({
      quickNavDelay: 0,
      crossProductSearchDelay: 0,
    });
    await renderAndWaitForUpdate();
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
      validateEvent(event, GlobalSearchDrawerEvent);
    });

    it('should trigger show prequery results event ', () => {
      expect(onEventSpy).toBeCalled();
      const event = onEventSpy.mock.calls[1][0];
      validateEvent(
        event,
        PreQuerySearchResultsEvent([
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
        ]),
      );
    });
  });
});
