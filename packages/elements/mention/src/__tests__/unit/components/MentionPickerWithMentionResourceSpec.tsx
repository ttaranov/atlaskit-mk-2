import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';

import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';

import * as UtilAnalytics from '../../../util/analytics';

import { MentionsResult } from '../../../types';
import { MentionPicker, Props, State } from '../../../components/MentionPicker';
import MentionResource from '../../../api/MentionResource';
import { resultC } from '../_mention-search-results';

const mentionResource = new MentionResource({
  url: 'boo.com/mentions',
});

function setupPicker(props?: Props): ReactWrapper<Props, State> {
  return mount(
    <MentionPicker
      resourceProvider={mentionResource}
      query=""
      createAnalyticsEvent={jest.fn()}
      {...props}
    />,
  ) as ReactWrapper<Props, State>;
}

describe('MentionPicker', () => {
  const query = 'c';
  const props = { query } as Props;
  const mentionsResult: MentionsResult = {
    mentions: resultC,
    query,
  };
  let fireAnalyticsMock;
  let fireAnalyticsReturn;

  beforeEach(() => {
    fireAnalyticsMock = jest.spyOn(
      UtilAnalytics,
      'fireAnalyticsMentionTypeaheadEvent',
    );
    fireAnalyticsReturn = jest.fn();
    fireAnalyticsMock.mockReturnValue(fireAnalyticsReturn);

    fetchMock.mock(/\/mentions\/search\?.*query=c(&|$)/, {
      body: {
        mentions: resultC,
      },
    });

    setupPicker(props);
  });

  afterEach(() => {
    fetchMock.restore();
    fireAnalyticsMock.mockReset();
    fireAnalyticsReturn.mockReset();
  });

  it('should fire analytics when new mention data is fetched', () => {
    mentionResource.notify(Date.now(), mentionsResult, query, true);

    return new Promise(resolve => setTimeout(resolve)).then(() => {
      expect(fireAnalyticsMock).toHaveBeenCalled();

      const firstArgument = fireAnalyticsMock.mock.calls[0][0];
      expect(firstArgument.query).toBe(query);

      expect(fireAnalyticsReturn).toHaveBeenCalledWith(
        'rendered',
        expect.any(Number),
        [
          '1810620',
          '1293711',
          '2866665',
          '89149',
          '1122770',
          '1384515',
          '372531',
          '357702',
          '2011825',
          '84107',
        ],
        query,
      );
    });
  });

  it('should not fire analytics when mention data is from local search', () => {
    mentionResource.notify(Date.now(), mentionsResult, query, false);

    return new Promise(resolve => setTimeout(resolve)).then(() => {
      expect(fireAnalyticsMock).not.toHaveBeenCalled();
    });
  });
});
