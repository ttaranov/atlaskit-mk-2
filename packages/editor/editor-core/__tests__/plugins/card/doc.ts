import { pluginKey } from '../../../src/plugins/card/pm-plugins/main';
import cardPlugin from '../../../src/plugins/card';
import { CardProvider, CardPluginState } from '../../../src/plugins/card/types';
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
  CardMockProvider,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';

import { setTextSelection } from '../../../src/utils';

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
      it('keeps positions the same for typing after the link', () => {
        const href = 'http://www.atlassian.com/';

        const { editorView, refs } = editor(
          doc(p('hello have a link {<>}', a({ href })(href))),
        );

        const { state, dispatch } = editorView;

        const provider = new CardMockProvider();
        setProvider(provider)(state, dispatch);

        const promise = queueCard(href, refs['<>'], 'inline')(editorView);

        // should be at initial pos
        const initialState = {
          requests: [{ url: href, pos: refs['<>'], appearance: 'inline' }],
          provider: provider,
        } as CardPluginState;
        expect(pluginKey.getState(editorView.state)).toEqual(initialState);

        // type something at end
        setTextSelection(editorView, editorView.state.doc.nodeSize - 2);
        insertText(editorView, 'more text', editorView.state.selection.from);

        // nothing should have changed
        expect(pluginKey.getState(editorView.state)).toEqual(initialState);
        return promise;
      });

      it('remaps positions for typing before the link', () => {
        const href = 'http://www.atlassian.com/';

        const { editorView, refs } = editor(
          doc(p('{<>}hello have a link', a({ href })('{link}' + href))),
        );

        const { state, dispatch } = editorView;

        const provider = new CardMockProvider();
        setProvider(provider)(state, dispatch);

        const promise = queueCard(href, refs['link'], 'inline')(editorView);

        // type something at start
        const typedText = 'before everything';
        insertText(editorView, typedText, refs['<>']);

        // nothing should have changed
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            {
              url: href,
              pos: refs['link'] + typedText.length,
              appearance: 'inline',
            },
          ],
          provider: provider,
        } as CardPluginState);
        return promise;
      });

      it('only remaps the relevant link based on position', () => {
        const hrefs = {
          A: 'http://www.atlassian.com/',
          B: 'http://www.google.com/',
        };

        // create a doc with 2 links
        const { editorView, refs } = editor(
          doc(
            p(
              'hello have a link {<>}',
              a({ href: hrefs.A })('{A}' + hrefs.B),
              ' and {middle} another ',
              a({ href: hrefs.B })('{B}' + hrefs.B),
            ),
          ),
        );

        const { state, dispatch } = editorView;

        const provider = new CardMockProvider();
        setProvider(provider)(state, dispatch);

        // queue both links
        const promises = Object.keys(hrefs).map(key => {
          return queueCard(hrefs[key], refs[key], 'inline')(editorView);
        });

        // everything should be at initial pos
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            { url: hrefs['A'], pos: refs['A'], appearance: 'inline' },
            { url: hrefs['B'], pos: refs['B'], appearance: 'inline' },
          ],
          provider: provider,
        });

        // type something in between the links
        insertText(editorView, 'ok', refs['middle']);

        // only B should have moved 2 to the right
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            { url: hrefs['A'], pos: refs['A'], appearance: 'inline' },
            { url: hrefs['B'], pos: refs['B'] + 2, appearance: 'inline' },
          ],

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
            return Promise.reject('error');
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
          requests: [],
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

      setProvider(new CardMockProvider())(
        editorView.state,
        editorView.dispatch,
      );

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

      setProvider(new CardMockProvider())(
        editorView.state,
        editorView.dispatch,
      );

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
