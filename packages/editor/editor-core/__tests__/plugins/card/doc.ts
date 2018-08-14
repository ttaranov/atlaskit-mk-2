import { pluginKey } from '../../../src/plugins/card/pm-plugins/main';
import cardPlugin from '../../../src/plugins/card';
import { CardProvider } from '../../../src/plugins/card/types';
import {
  setProvider,
  queueCard,
} from '../../../src/plugins/card/pm-plugins/actions';

import {
  doc,
  createEditor,
  p,
  a,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';

import { MockProvider } from './util';
import { setTextSelection } from '@atlaskit/editor-core';

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
      const initialDoc = doc(
        p('hello have a link ', a({ href })('{<>}' + href)),
      );

      let view: EditorView;
      let provider: CardProvider;

      beforeEach(() => {
        const { editorView } = editor(initialDoc);
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

        expect(view.state.doc).toEqualDocument(initialDoc);
      });
    });

    it('does not replace if link text changes', async () => {
      const href = 'http://www.atlassian.com/';
      const { editorView } = editor(
        doc(p('hello have a link ', a({ href })('{<>}' + href))),
      );

      setProvider(new MockProvider())(editorView.state, editorView.dispatch);

      // queue it
      const promise = queueCard(
        href,
        editorView.state.selection.from,
        'inline',
      )(editorView);

      // now, change the link text (+1 so we change inside the text node with the mark, otherwise
      // we prefer to change on the other side of the boundary)
      insertText(editorView, 'change', editorView.state.selection.from + 1);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'hello have a link ',
            a({ href })(href[0] + 'change{<>}' + href.slice(1)),
          ),
        ),
      );

      // resolve the provider
      await promise;

      // link should not have been replaced, but text will have changed
      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'hello have a link ',
            a({ href })(href[0] + 'change{<>}' + href.slice(1)),
          ),
        ),
      );
    });

    it('does not replace if position is some other content', async () => {
      const href = 'http://www.atlassian.com/';
      const initialDoc = doc(p('hello have a link '), p('{<>}' + href));

      const { editorView } = editor(initialDoc);

      setProvider(new MockProvider())(editorView.state, editorView.dispatch);

      // queue a non-link node
      const promise = queueCard(
        href,
        editorView.state.selection.from,
        'inline',
      )(editorView);

      // resolve the provider
      await promise;

      // nothing should change
      expect(editorView.state.doc).toEqualDocument(initialDoc);
    });
  });
});
