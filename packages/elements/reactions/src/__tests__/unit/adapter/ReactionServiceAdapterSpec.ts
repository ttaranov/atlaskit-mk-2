import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock/src/client';

import { ReactionServiceAdapter } from '../../../adapter/ReactionServiceAdapter';

describe('ReactionServiceAdapter', () => {
  const baseUrl = 'http://reactions.atlassian.com';
  const containerAri = 'container-123';
  const aris = ['ari-1', 'ari-2'];
  let reactionServiceAdapter: ReactionServiceAdapter;

  const getDetailedReactionResponse = {
    ari: aris[0],
    containerAri,
    emojiId: 'smile',
    count: 1,
    reacted: true,
    users: [
      {
        id: 'abc-123',
        displayName: 'Some real user',
      },
    ],
  };

  const addReactionResponse = {
    reactions: [
      {
        ari: aris[0],
        containerAri,
        emojiId: 'smile',
        count: 1,
        reacted: true,
      },
    ],
  };

  const deleteReactionResponse = { reactions: [] };

  beforeAll(() => {
    reactionServiceAdapter = new ReactionServiceAdapter(baseUrl);
    fetchMock.mock({
      method: 'POST',
      matcher: 'end:/reactions/view',
      response: {
        body: {
          'ari-1': [],
          'ari-2': [],
        },
      },
      name: 'reactionsView',
    });

    fetchMock.mock({
      method: 'GET',
      matcher: 'end:/reactions?reactionId=container-123%7Cari-1%7Csmile',
      response: {
        body: getDetailedReactionResponse,
      },
      name: 'getDetailedReaction',
    });

    fetchMock.mock({
      method: 'POST',
      matcher: 'end:/reactions',
      response: {
        body: addReactionResponse,
      },
      name: 'addReaction',
    });

    fetchMock.mock({
      method: 'DELETE',
      matcher:
        'end:/reactions?ari=ari-1&emojiId=smile&containerAri=container-123',
      response: {
        body: deleteReactionResponse,
      },
      name: 'deleteReaction',
    });
  });

  afterAll(() => {
    fetchMock.restore();
  });

  it('should get reactions', () =>
    reactionServiceAdapter
      .getReactions(containerAri, aris)
      .then(response => {
        expect(response).toMatchObject({
          'ari-1': [],
          'ari-2': [],
        });
      })
      .then(() => {
        const call = fetchMock.lastCall()[0];
        expect(call.method).toEqual('POST');
        expect(call.url).toMatch(
          'http://reactions.atlassian.com/reactions/view',
        );
        return call.json();
      })
      .then(body => {
        expect(body).toMatchObject({
          containerAri,
          aris,
        });
      }));

  it('should get detailed reaction', () =>
    reactionServiceAdapter
      .getDetailedReaction(containerAri, aris[0], 'smile')
      .then(response => {
        expect(response).toMatchObject(getDetailedReactionResponse);
      })
      .then(() => {
        const call = fetchMock.lastCall()[0];
        expect(call.method).toEqual('GET');
        expect(call.url).toMatch(
          'http://reactions.atlassian.com/reactions?reactionId=container-123%7Cari-1%7Csmile',
        );
      }));

  it('should add reaction', () =>
    reactionServiceAdapter
      .addReaction(containerAri, aris[0], 'smile')
      .then(response => {
        expect(response).toMatchObject(addReactionResponse.reactions);
      })
      .then(() => {
        const call = fetchMock.lastCall()[0];
        expect(call.method).toEqual('POST');
        expect(call.url).toMatch('http://reactions.atlassian.com/reactions');
        return call.json();
      })
      .then(body => {
        expect(body).toMatchObject({
          containerAri,
          ari: aris[0],
          emojiId: 'smile',
        });
      }));

  it('should delete reaction', () =>
    reactionServiceAdapter
      .deleteReaction(containerAri, aris[0], 'smile')
      .then(response => {
        expect(response).toMatchObject(deleteReactionResponse.reactions);
      })
      .then(() => {
        const call = fetchMock.lastCall()[0];
        expect(call.method).toEqual('DELETE');
        expect(call.url).toMatch(
          'http://reactions.atlassian.com/reactions?ari=ari-1&emojiId=smile&containerAri=container-123',
        );
      }));
});
