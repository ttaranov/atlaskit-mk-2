import { pluginKey } from '../../../src/plugins/card/pm-plugins/main';
import cardPlugin from '../../../src/plugins/card';
import { CardProvider } from '../../../src/plugins/card/types';
import {
  setProvider,
  queueCard,
  queueCardFromSlice,
} from '../../../src/plugins/card/pm-plugins/actions';

import {
  doc,
  createEditor,
  p,
  a,
  CardMockProvider,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import { Slice, Fragment } from 'prosemirror-model';

describe('card', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [cardPlugin],
      pluginKey,
    });
  };

  describe('actions', () => {
    describe('setProvider', () => {
      it('sets the card provider', () => {
        const { editorView } = editor(doc(p()));
        const { state, dispatch } = editorView;

        const provider = new CardMockProvider();
        setProvider(provider)(state, dispatch);

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: {},
          schema: editorView.state.schema,
          provider: provider,
        });
      });
    });

    describe('queueCard', () => {
      describe('without provider', () => {
        it('does nothing if no provider has been set yet', () => {
          const { editorView } = editor(doc(p()));
          queueCard('http://www.atlassian.com/', 24, 'inline')(editorView);
          expect(pluginKey.getState(editorView.state)).toEqual({
            requests: {},
            schema: editorView.state.schema,
            provider: null,
          });
        });
      });

      describe('with mock provider', () => {
        let editorView: EditorView;
        let provider: CardProvider;

        beforeEach(() => {
          const { editorView: view } = editor(doc(p()));
          editorView = view;

          const { state, dispatch } = view;

          provider = new CardMockProvider();
          setProvider(provider)(state, dispatch);
        });

        it('adds a url to the queue', () => {
          queueCard('http://www.atlassian.com/', 0, 'inline')(editorView);
          expect(pluginKey.getState(editorView.state)).toEqual({
            requests: {
              'http://www.atlassian.com/': {
                positions: [0],
              },
            },
            schema: editorView.state.schema,
            provider: provider,
          });
        });

        it('queues the link in a slice as the only node', () => {
          const href = 'http://www.atlassian.com/';
          const linkDoc = p(a({ href })(href));
          queueCardFromSlice(
            new Slice(Fragment.from(linkDoc(editorView.state.schema)), 1, 1),
            0,
          )(editorView);

          expect(pluginKey.getState(editorView.state)).toEqual({
            requests: {
              'http://www.atlassian.com/': {
                positions: [1],
              },
            },
            schema: editorView.state.schema,
            provider: provider,
          });
        });

        it('eventually resolves the url from the queue', async () => {
          const promise = queueCard('http://www.atlassian.com/', 0, 'inline')(
            editorView,
          );
          expect(pluginKey.getState(editorView.state)).toEqual({
            requests: {
              'http://www.atlassian.com/': {
                positions: [0],
              },
            },
            schema: editorView.state.schema,
            provider: provider,
          });

          await promise;

          expect(pluginKey.getState(editorView.state)).toEqual({
            requests: {},
            schema: editorView.state.schema,
            provider: provider,
          });
        });
      });
    });
  });
});
