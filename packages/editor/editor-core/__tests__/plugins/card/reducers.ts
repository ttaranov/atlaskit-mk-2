import { pluginKey } from '../../../src/plugins/card/pm-plugins/main';
import cardPlugin from '../../../src/plugins/card';
import {
  doc,
  createEditor,
  p,
  cardProvider,
} from '@atlaskit/editor-test-helpers';
import reduce from '../../../src/plugins/card/pm-plugins/reducers';
import { CardPluginState } from '../../../src/plugins/card/types';

describe('card', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [cardPlugin],
      pluginKey,
    });
  };

  describe('reducers', () => {
    let editorState;
    let initialState;
    beforeAll(() => {
      const { editorView, pluginState } = editor(doc(p()));
      editorState = editorView.state;
      initialState = pluginState;
    });

    describe('#state.init', () => {
      it('creates an empty state, copying in schema', () => {
        expect(initialState).toEqual({
          requests: {},
          schema: editorState.schema,
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
              url: 'http://www.atlassian.com/',
              pos: 42,
            }),
          ).toEqual({
            requests: {
              'http://www.atlassian.com/': {
                positions: [42],
              },
            },
            provider: null,
            schema: editorState.schema,
          } as CardPluginState);
        });

        it('queues multiple items for the same URL', () => {
          const first = reduce(initialState, {
            type: 'QUEUE',
            url: 'http://www.atlassian.com/',
            pos: 42,
          });

          expect(
            reduce(first, {
              type: 'QUEUE',
              url: 'http://www.atlassian.com/',
              pos: 420,
            }),
          ).toEqual({
            requests: {
              'http://www.atlassian.com/': {
                positions: [42, 420],
              },
            },
            provider: null,
            schema: editorState.schema,
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
            requests: {},
            provider: cardProvider,
            schema: editorState.schema,
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
            url: 'http://www.atlassian.com/',
            pos: 42,
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
                url: 'http://www.atlassian.com/',
                pos,
              }),
            initialState,
          );

          // add another, distinct URL which we don't intend to resolve
          const combined = reduce(withSameUrl, {
            type: 'QUEUE',
            url: 'http://www.google.com/',
            pos: 0,
          });

          // resolve the first one, leaving the other one
          expect(
            reduce(combined, {
              type: 'RESOLVE',
              url: 'http://www.atlassian.com/',
            }),
          ).toEqual({
            requests: {
              'http://www.google.com/': {
                positions: [0],
              },
            },
            provider: null,
            schema: editorState.schema,
          } as CardPluginState);
        });
      });
    });
  });
});
