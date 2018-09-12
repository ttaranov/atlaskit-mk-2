import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import cardPlugin from '../../../../plugins/card';
import {
  doc,
  createEditor,
  p,
  cardProvider,
} from '@atlaskit/editor-test-helpers';
import reduce from '../../../../plugins/card/pm-plugins/reducers';
import { CardPluginState } from '../../../../plugins/card/types';

describe('card', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [cardPlugin],
      pluginKey,
    });
  };

  describe('reducers', () => {
    let initialState;
    beforeAll(() => {
      const { pluginState } = editor(doc(p()));
      initialState = pluginState;
    });

    describe('#state.init', () => {
      it('creates an empty state', () => {
        expect(initialState).toEqual({
          requests: [],
          provider: null,
        });
      });
    });

    describe('#state.update', () => {
      describe('queue', () => {
        it('can queue an item', () => {
          expect(
            reduce(initialState, {
              type: 'QUEUE',
              requests: [
                {
                  url: 'http://www.atlassian.com/',
                  pos: 42,
                  appearance: 'inline',
                },
              ],
            }),
          ).toEqual({
            requests: [
              {
                url: 'http://www.atlassian.com/',
                pos: 42,
                appearance: 'inline',
              },
            ],
            provider: null,
          } as CardPluginState);
        });

        it('queues multiple items for the same URL', () => {
          const first = reduce(initialState, {
            type: 'QUEUE',
            requests: [
              {
                url: 'http://www.atlassian.com/',
                pos: 42,
                appearance: 'inline',
              },
            ],
          });

          expect(
            reduce(first, {
              type: 'QUEUE',
              requests: [
                {
                  url: 'http://www.atlassian.com/',
                  pos: 420,
                  appearance: 'inline',
                },
              ],
            }),
          ).toEqual({
            requests: [
              {
                url: 'http://www.atlassian.com/',
                pos: 42,
                appearance: 'inline',
              },
              {
                url: 'http://www.atlassian.com/',
                pos: 420,
                appearance: 'inline',
              },
            ],
            provider: null,
          } as CardPluginState);
        });
      });

      describe('set provider', () => {
        it('sets provider', () => {
          expect(
            reduce(initialState, {
              type: 'SET_PROVIDER',
              provider: cardProvider,
            }),
          ).toEqual({
            requests: [],
            provider: cardProvider,
          });
        });
      });

      describe('resolve', () => {
        it('does nothing to an unqueued URL', () => {
          expect(
            reduce(initialState, {
              type: 'RESOLVE',
              url: 'http://www.unknown.com/',
            }),
          ).toEqual(initialState);
        });

        it('resolves a single queued URL', () => {
          const added = reduce(initialState, {
            type: 'QUEUE',
            requests: [
              {
                url: 'http://www.atlassian.com/',
                pos: 42,
                appearance: 'inline',
              },
            ],
          });

          expect(
            reduce(added, {
              type: 'RESOLVE',
              url: 'http://www.atlassian.com/',
            }),
          ).toEqual(initialState);
        });

        it('resolves multiple queued URLs', () => {
          // queue two links with the same URL
          const withSameUrl = [42, 420].reduce(
            (state, pos) =>
              reduce(state, {
                type: 'QUEUE',
                requests: [
                  {
                    url: 'http://www.atlassian.com/',
                    pos,
                    appearance: 'inline',
                  },
                ],
              }),
            initialState,
          );

          // add another, distinct URL which we don't intend to resolve
          const combined = reduce(withSameUrl, {
            type: 'QUEUE',
            requests: [
              {
                url: 'http://www.google.com/',
                pos: 0,
                appearance: 'inline',
              },
            ],
          });

          // resolve the first one, leaving the other one
          expect(
            reduce(combined, {
              type: 'RESOLVE',
              url: 'http://www.atlassian.com/',
            }),
          ).toEqual({
            requests: [
              {
                url: 'http://www.google.com/',
                pos: 0,
                appearance: 'inline',
              },
            ],
            provider: null,
          } as CardPluginState);
        });
      });
    });
  });
});
