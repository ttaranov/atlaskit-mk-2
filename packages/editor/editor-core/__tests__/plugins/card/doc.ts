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
  insertText,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import { Slice, Fragment } from 'prosemirror-model';

import { MockProvider } from './util';
import { setTextSelection } from '../../../../editor-test-helpers/node_modules/@atlaskit/editor-core/src';

describe('card', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [cardPlugin],
      pluginKey,
    });
  };

  describe('doc', () => {
    describe('#state.update', async () => {
      it('remaps document positions for items in queue', () => {
        const hrefs = {
          A: 'http://www.atlassian.com/',
          B: 'http://www.google.com/',
        };

        const { editorView, refs } = editor(
          doc(
            p(
              'hello have a link {<>}',
              a({ href: hrefs.A })('{A}' + hrefs.B),
              ' and another ',
              a({ href: hrefs.B })('{B}' + hrefs.B),
            ),
          ),
        );

        const { state, dispatch } = editorView;

        const provider = new MockProvider();
        setProvider(provider)(state, dispatch);

        const initialPos = state.selection.from;

        const promises = Object.keys(hrefs).map(key => {
          // queue some stuff before the current position
          return queueCard(hrefs[key], refs[key], 'inline')(editorView);
        });

        // everything should be at initial pos
        const initialRequests = Object.keys(hrefs).reduce((requests, key) => {
          requests[hrefs[key]] = { positions: [refs[key]] };
          return requests;
        }, {});

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: initialRequests,
          schema: editorView.state.schema,
          provider: provider,
        });

        // type something
        insertText(editorView, 'ok', initialPos);

        // all positions should have moved 2 places to the right
        const mappedRequests = Object.keys(hrefs).reduce((requests, key) => {
          requests[hrefs[key]] = { positions: [refs[key] + 2] };
          return requests;
        }, {});

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: mappedRequests,
          schema: editorView.state.schema,
          provider: provider,
        });

        // move to end, and type again
        setTextSelection(editorView, editorView.state.doc.nodeSize - 2);
        insertText(editorView, 'more text', editorView.state.selection.from);

        // ensure nothing changed (since the links were before the typing)
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: mappedRequests,
          schema: editorView.state.schema,
          provider: provider,
        });

        // empty the promise queue
        return Promise.all(promises);
      });
    });

    describe('provider', () => {
      const href = 'http://www.atlassian.com/';
      const initialDocument = doc(
        p('hello have a link ', a({ href })('{<>}' + href)),
      );

      let view: EditorView;
      let provider: CardProvider;

      beforeEach(() => {
        const { editorView } = editor(initialDocument);
        view = editorView;
      });

      it('does not replace if provider returns invalid ADF', async () => {
        const doc = {
          type: 'mediaSingle',
          content: [
            {
              type: 'panel',
              content: [
                {
                  text: 'hello world',
                  type: 'text',
                },
              ],
            },
          ],
        };

        provider = new class implements CardProvider {
          resolve(url: string): Promise<any> {
            return new Promise(resolve => {
              resolve(doc);
            });
          }
        }();

        setProvider(provider)(view.state, view.dispatch);

        // try to replace the link using bad provider
        expect(
          queueCard(href, view.state.selection.from, 'inline')(view),
        ).resolves.toEqual(doc);
      });

      it('does not replace if provider rejects', async () => {
        provider = new class implements CardProvider {
          resolve(url: string): Promise<any> {
            return new Promise((resolve, reject) => {
              reject('error');
            });
          }
        }();

        setProvider(provider)(view.state, view.dispatch);

        // try to replace the link using bad provider
        expect(
          queueCard(href, view.state.selection.from, 'inline')(view),
        ).rejects.toEqual('error');
      });

      afterEach(async () => {
        // queue should now be empty, and document should remain the same
        expect(pluginKey.getState(view.state)).toEqual({
          requests: {},
          schema: view.state.schema,
          provider: provider,
        });

        expect(view.state.doc).toEqualDocument(initialDocument);
      });
    });

    it('does not replace if link text changes', () => {});

    it('does not replace if position is some other content', () => {});
  });
});
