import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';
import { SecurityOptions } from '@atlaskit/util-service-support';
import * as queryString from 'query-string';

import { MentionDescription } from '../../../types';
import MentionResource, {
  MentionResourceConfig,
  MentionStats,
} from '../../../api/MentionResource';
import {
  resultC,
  resultCr,
  resultCraig,
  resultPolly,
} from '../_mention-search-results';

const baseUrl = 'https://bogus/mentions';

const defaultSecurityHeader = 'X-Bogus';

const options = (
  code: string | number,
  omitCredentials: boolean,
): SecurityOptions => ({
  headers: {
    [defaultSecurityHeader]: code,
  },
  omitCredentials,
});

const getSecurityHeader = call => call[1].headers.get(defaultSecurityHeader);

const defaultSecurityCode = '10804';

const apiConfig: MentionResourceConfig = {
  url: baseUrl,
  securityProvider() {
    return options(defaultSecurityCode, false);
  },
};

const apiConfigWithoutCredentials: MentionResourceConfig = {
  url: baseUrl,
  securityProvider() {
    return options(defaultSecurityCode, true);
  },
};

function checkOrder(expected, actual) {
  expect(actual).toHaveLength(expected.length);
  for (let i = 0; i < expected.length; i++) {
    expect(actual[i]).toHaveLength(expected[i].length);
    if (expected[i].length) {
      for (let j = 0; j < expected[i].length; j++) {
        expect(actual[i][j].id).toEqual(expected[i][j].id);
      }
    }
  }
}

const FULL_CONTEXT = {
  containerId: 'someContainerId',
  objectId: 'someObjectId',
  childObjectId: 'someChildObjectId',
  sessionId: 'someSessionId',
};

describe('MentionResource', () => {
  beforeEach(() => {
    fetchMock.mock(
      /\/mentions\/search\?.*query=esoares(&|$)/,
      {
        body: {
          mentions: [],
        },
      },
      options(defaultSecurityCode, true),
    ),
      fetchMock
        .mock(/\/mentions\/search\?.*query=craig(&|$)/, {
          body: {
            mentions: resultCraig,
          },
        })
        .mock(/\/mentions\/search\?.*query=c(&|$)/, {
          body: {
            mentions: resultC,
          },
        })
        .mock(/\/mentions\/bootstrap$/, {
          body: {
            mentions: resultC,
          },
        })
        .mock(/\/mentions\/search\?.*query=polly(&|$)/, {
          body: {
            mentions: resultPolly,
          },
        })
        .mock(
          /\/mentions\/search\?.*query=cr(&|$)/,
          new Promise(resolve => {
            setTimeout(() => {
              resolve({
                // delayed results
                body: {
                  mentions: resultCr,
                },
              });
            }, 100);
          }),
        )
        .mock(/\/mentions\/search\?.*query=broken(&|$)/, 500)
        .mock(/\/mentions\/search\?.*query=.*(&|$)/, {
          body: {
            mentions: [],
          },
        })
        .mock(
          /\/mentions\/record\?selectedUserId=\d+.*$/,
          {
            body: '',
          },
          { name: 'record' },
        );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('#subscribe', () => {
    it('subscribe should receive updates', done => {
      const resource = new MentionResource({
        ...apiConfig,
        containerId: 'defaultContainerId', // should be ignored
      });
      resource.subscribe('test1', mentions => {
        expect(mentions).toHaveLength(resultCraig.length);

        const queryParams = queryString.parse(
          queryString.extract(fetchMock.lastUrl()),
        );

        expect(queryParams.containerId).toBe('someContainerId');
        expect(queryParams.objectId).toBe('someObjectId');
        expect(queryParams.childObjectId).toBe('someChildObjectId');
        expect(queryParams.sessionId).toBe('someSessionId');
        expect(fetchMock.lastOptions().credentials).toEqual('include');
        done();
      });
      resource.filter('craig', FULL_CONTEXT);
    });

    it('multiple subscriptions should receive updates', done => {
      const resource = new MentionResource({
        ...apiConfig,
        containerId: 'defaultContainerId',
      });
      let count = 0;
      resource.subscribe('test1', mentions => {
        expect(mentions).toHaveLength(resultCraig.length);

        const queryParams = queryString.parse(
          queryString.extract(fetchMock.lastUrl()),
        );
        // default containerId from config should be used
        expect(queryParams.containerId).toBe('defaultContainerId');

        count++;
        if (count === 2) {
          done();
        }
      });
      resource.subscribe('test2', mentions => {
        expect(mentions).toHaveLength(resultCraig.length);
        count++;
        if (count === 2) {
          done();
        }
      });
      resource.filter('craig');
    });

    it('subscribe should receive updates with credentials omitted', done => {
      const resource = new MentionResource(apiConfigWithoutCredentials);
      resource.subscribe('test3', mentions => {
        expect(mentions).toHaveLength(0);
        const requestData = fetchMock.lastOptions();
        expect(requestData.credentials).toEqual('omit');
        done();
      });
      resource.filter('esoares');
    });
  });

  describe('#unsubscribe', () => {
    it('subscriber should no longer called', done => {
      const resource = new MentionResource(apiConfig);
      const listener = jest.fn();
      resource.subscribe('test1', listener);
      resource.unsubscribe('test1');
      resource.filter('craig');
      // Not desirable...
      setTimeout(() => {
        expect(listener).toHaveBeenCalledTimes(0);
        done();
      }, 50);
    });
  });

  describe('#filter', () => {
    it('should add weight based on response order - bootstrap', done => {
      const resource = new MentionResource(apiConfig);
      resource.subscribe(
        'test1',
        (mentions, query: string, stats?: MentionStats) => {
          for (let i = 0; i < mentions.length; i++) {
            expect(mentions[i].weight).toBe(i);
          }
          expect(stats).toBeDefined();
          expect(stats!.duration).toBeGreaterThan(0);
          expect(stats!.remoteSearch).toBeTruthy();
          done();
        },
      );
      resource.filter('');
    });

    // TODO: JEST-23 - skipping as it failed in landkid - needs to be investigated
    // https://bitbucket.org/atlassian/atlaskit-mk-2/addon/pipelines/home#!/results/35513/steps/%7B6c9f6e68-2d31-4029-a7ce-d9bc3a76d831%7D/test-report
    // it('should add weight based on response order', done => {
    //   const resource = new MentionResource(apiConfig);
    //   resource.subscribe(
    //     'test1',
    //     (mentions, query: string, stats?: MentionStats) => {
    //       for (let i = 0; i < mentions.length; i++) {
    //         expect(mentions[i].weight).toBe(i);
    //       }
    //       expect(stats).toBeDefined();
    //       expect(stats!.duration).toBeGreaterThan(0);
    //       expect(stats!.remoteSearch).toBeTruthy();
    //       done();
    //     },
    //   );
    //   resource.filter('c');
    // });

    it('in order responses', done => {
      const resource = new MentionResource(apiConfig);
      let sequence = 0;

      resource.subscribe(
        'test1',
        (mentions, query: string, stats?: MentionStats) => {
          sequence++;

          expect(stats).toBeDefined();

          // 1st: remote search for 'c'
          // 2nd: local index for 'craig'  => no results
          // 3rd: remote search for 'craig'

          if (sequence === 1) {
            expect(query).toBe('c');
            expect(mentions).toBe(resultC);
            expect(stats!.duration).toBeGreaterThan(0);
            expect(stats!.remoteSearch).toBeTruthy();
          }

          if (sequence === 2) {
            expect(query).toBe('craig');
            expect(mentions).toBe([]);
            expect(stats!.duration).toBeGreaterThan(0);
            expect(stats!.remoteSearch).toBeFalsy();
          }

          if (sequence === 3) {
            expect(query).toBe('craig');
            expect(mentions).toMatchObject(resultCraig);
            expect(stats!.duration).toBeGreaterThan(0);
            expect(stats!.remoteSearch).toBeTruthy();
            done();
          }
        },
      );
      resource.filter('c');
      setTimeout(() => {
        resource.filter('craig');
      }, 10);
    });

    it('all results callback should receive all results', done => {
      const resource = new MentionResource(apiConfig);
      const results: MentionDescription[][] = [];
      const expected = [resultCraig, resultCr];
      resource.subscribe('test1', undefined, undefined, undefined, mentions => {
        results.push(mentions);

        if (results.length === 2) {
          checkOrder(expected, results);

          const queryParams = queryString.parse(
            queryString.extract(fetchMock.lastUrl()),
          );
          expect(queryParams.containerId).toBe('someContainerId');
          expect(queryParams.objectId).toBe('someObjectId');
          done();
        }
      });
      resource.filter('cr', {
        containerId: 'someContainerId',
        objectId: 'someObjectId',
      });
      resource.filter('craig', {
        containerId: 'someContainerId',
        objectId: 'someObjectId',
      });
    });

    // Temporarily disabled due to failing on Mobile Safari 9.0.0.
    it.skip('out of order responses', done => {
      // eslint-disable-line
      const resource = new MentionResource(apiConfig);
      const results: MentionDescription[][] = [];
      const expected = [resultCraig];
      resource.subscribe('test1', mentions => {
        results.push(mentions);
        if (results.length === 1) {
          checkOrder(expected, results);
          done();
        }
        if (results.length > 1) {
          fail('More than one response was unexpected.');
        }
      });
      resource.filter('delay');
      setTimeout(() => {
        resource.filter('craig');
      }, 5);
    });

    it('error response', done => {
      const resource = new MentionResource(apiConfig);
      resource.subscribe(
        'test1',
        () => {
          throw new Error('listener should not be called');
        },
        () => {
          done();
        },
      );
      resource.filter('broken');
    });

    it('add APP lozenge for user of type App', done => {
      const resource = new MentionResource(apiConfig);
      resource.subscribe('test1', undefined, undefined, undefined, mentions => {
        expect(mentions).toHaveLength(1);
        expect(mentions[0].lozenge).toEqual('APP');

        done();
      });
      resource.filter('polly');
    });

    it('should use users in context to sort', done => {
      const craig = { id: '84029', name: 'Craig Petchell', nickname: 'homer' };
      const resource = new MentionResource({
        ...apiConfig,
        getUsersInContext: () => Promise.resolve([craig]),
      });

      const results: MentionDescription[][] = [];
      resource.subscribe('test1', undefined, undefined, undefined, mentions => {
        results.push(mentions);

        if (results.length === 1) {
          expect(results[0][0].name).toEqual(craig.name);
          done();
        }
      });

      resource.filter('craig');
    });
  });

  describe('#filter auth issues', () => {
    it('401 error once retry', done => {
      const authUrl = 'https://authbogus/';
      const matcher = `begin:${authUrl}`;

      fetchMock.get({
        name: 'authonce',
        matcher,
        response: 401,
        repeat: 1,
      });
      fetchMock.get({
        name: 'authonce2',
        matcher,
        response: {
          body: {
            mentions: resultCraig,
          },
        },
        repeat: 1,
      });

      const refreshedSecurityProvider = jest.fn();
      refreshedSecurityProvider.mockReturnValue(
        Promise.resolve(options('666', false)),
      );

      const retryConfig = {
        ...apiConfig,
        url: authUrl,
        refreshedSecurityProvider,
      };
      const resource = new MentionResource(retryConfig);
      resource.subscribe(
        'test1',
        () => {
          try {
            expect(refreshedSecurityProvider).toHaveBeenCalledTimes(1);
            const firstCall = fetchMock.calls('authonce');
            expect(getSecurityHeader(firstCall[0])).toEqual(
              defaultSecurityCode,
            );
            const secondCall = fetchMock.calls('authonce2');
            expect(getSecurityHeader(secondCall[0])).toEqual('666');
            done();
          } catch (ex) {
            done(ex);
          }
        },
        err => {
          fail('listener error called');
          done(err);
        },
      );
      resource.filter('test');
    });

    it('401 error twice retry', done => {
      const authUrl = 'https://authbogus/';
      const matcher = {
        name: 'authtwice',
        matcher: `begin:${authUrl}`,
      };

      fetchMock.mock({ ...matcher, response: 401 });

      const refreshedSecurityProvider = jest.fn();
      refreshedSecurityProvider.mockReturnValue(
        Promise.resolve(options(666, false)),
      );

      const retryConfig = {
        ...apiConfig,
        url: authUrl,
        refreshedSecurityProvider,
      };
      const resource = new MentionResource(retryConfig);
      resource.subscribe(
        'test1',
        () => {
          throw new Error('listener should not be called');
        },
        (err: Error) => {
          try {
            expect(refreshedSecurityProvider).toHaveBeenCalledTimes(1);
            expect((err as any).code).toEqual(401);
            const calls = fetchMock.calls(matcher.name);
            expect(calls).toHaveLength(2);
            expect(getSecurityHeader(calls[0])).toEqual(defaultSecurityCode);
            expect(getSecurityHeader(calls[1])).toEqual('666');
            done();
          } catch (ex) {
            done.fail(ex);
          }
        },
      );
      resource.filter('test');
    });

    it('401 for search when documents from previous search are already indexed', done => {
      fetchMock.restore();
      fetchMock
        .mock(/\/mentions\/search\?.*query=c(&|$)/, {
          body: {
            mentions: resultC,
          },
        })
        .mock(/.*\/mentions\/search\?.*query=cz(&|$)/, 401);

      const resource = new MentionResource(apiConfig);
      let count = 0;
      resource.subscribe(
        'test1',
        mentions => {
          count++;
          if (count === 1) {
            // the first call is for a remote search for 'c' and should return mentions.
            expect(mentions).toHaveLength(resultC.length);
          } else if (count === 2) {
            // the second call is from a search against the local index for 'cz' and should return no matches
            expect(mentions).toHaveLength(0);
          } else if (count > 2) {
            done(
              new Error(
                'Result callback was called more than expected. Error callback was expected.',
              ),
            );
          }
        },
        err => {
          expect((err as any).code).toEqual(401);
          done();
        },
      );

      resource.filter('c'); // this call should succeed and return mentions which get indexed locally
      setTimeout(() => {
        resource.filter('cz'); // this is the call that will result in a 401
      }, 10);
    });
  });

  describe('#recordMentionSelection', () => {
    it('should call record endpoint', done => {
      const resource = new MentionResource(apiConfig);
      resource
        .recordMentionSelection(
          {
            id: '666',
          },
          FULL_CONTEXT,
        )
        .then(() => {
          const queryParams = queryString.parse(
            queryString.extract(fetchMock.lastUrl()),
          );
          expect(queryParams.containerId).toBe('someContainerId');
          expect(queryParams.objectId).toBe('someObjectId');
          expect(queryParams.childObjectId).toBe('someChildObjectId');
          expect(queryParams.sessionId).toBe('someSessionId');
          expect(fetchMock.called('record')).toBe(true);
          done();
        });
    });
  });

  describe('#shouldHighlightMention', () => {
    it('should return false by default', () => {
      const resource = new MentionResource(apiConfig);
      expect(resource.shouldHighlightMention({ id: 'abcd-abcd-abcd' })).toBe(
        false,
      );
    });

    it('should use config if available', () => {
      const resource = new MentionResource({
        ...apiConfig,
        shouldHighlightMention: mention => mention.id === 'abcd-abcd-abcd',
      });

      expect(resource.shouldHighlightMention({ id: 'abcd-abcd-abcd' })).toBe(
        true,
      );
      expect(resource.shouldHighlightMention({ id: 'abcd-abcd' })).toBe(false);
    });
  });
});
