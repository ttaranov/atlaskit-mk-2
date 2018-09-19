import { pluginKey } from '../../../../plugins/card/pm-plugins/main';
import cardPlugin from '../../../../plugins/card';
import { CardProvider, CardPluginState } from '../../../../plugins/card/types';
import {
  setProvider,
  queueCards,
} from '../../../../plugins/card/pm-plugins/actions';

import {
  doc,
  createEditor,
  p,
  a,
  insertText,
  CardMockProvider,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';

import { setTextSelection } from '../../../../utils';
import { Fragment, Slice } from 'prosemirror-model';
import { queueCardsFromChangedTr } from '../../../../plugins/card/pm-plugins/doc';

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
        dispatch(
          queueCards([{ url: href, pos: refs['<>'], appearance: 'inline' }])(
            state.tr,
          ),
        );

        // should be at initial pos
        const initialState = {
          requests: [{ url: href, pos: refs['<>'], appearance: 'inline' }],
          provider: null,
        } as CardPluginState;
        expect(pluginKey.getState(editorView.state)).toEqual(initialState);

        // type something at end
        setTextSelection(editorView, editorView.state.doc.nodeSize - 2);
        insertText(editorView, 'more text', editorView.state.selection.from);

        // nothing should have changed
        expect(pluginKey.getState(editorView.state)).toEqual(initialState);
      });

      it('queues the link in a slice as the only node', () => {
        const href = 'http://www.atlassian.com/';
        const linkDoc = p(
          a({
            href,
          })(href),
        );

        const { editorView } = editor(doc(p('blah')));

        const from = 0;
        const to = editorView.state.doc.nodeSize - 2;
        const tr = editorView.state.tr.replaceRange(
          from,
          to,
          new Slice(Fragment.from(linkDoc(editorView.state.schema)), 1, 1),
        );

        editorView.dispatch(queueCardsFromChangedTr(editorView.state, tr));

        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            {
              url: 'http://www.atlassian.com/',
              pos: 1,
              appearance: 'inline',
            },
          ],
          provider: null,
        });
      });

      it('remaps positions for typing before the link', () => {
        const href = 'http://www.atlassian.com/';

        const { editorView, refs } = editor(
          doc(p('{<>}hello have a link', a({ href })('{link}' + href))),
        );

        const { state, dispatch } = editorView;
        dispatch(
          queueCards([{ url: href, pos: refs['link'], appearance: 'inline' }])(
            state.tr,
          ),
        );

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
          provider: null,
        } as CardPluginState);
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

        const { dispatch } = editorView;

        // queue both links
        Object.keys(hrefs).map(key => {
          dispatch(
            queueCards([
              { url: hrefs[key], pos: refs[key], appearance: 'inline' },
            ])(editorView.state.tr),
          );
        });

        // everything should be at initial pos
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            { url: hrefs['A'], pos: refs['A'], appearance: 'inline' },
            { url: hrefs['B'], pos: refs['B'], appearance: 'inline' },
          ],
          provider: null,
        });

        // type something in between the links
        insertText(editorView, 'ok', refs['middle']);

        // only B should have moved 2 to the right
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [
            { url: hrefs['A'], pos: refs['A'], appearance: 'inline' },
            { url: hrefs['B'], pos: refs['B'] + 2, appearance: 'inline' },
          ],

          provider: null,
        });
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
        const { dispatch } = view;
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

        dispatch(setProvider(provider)(view.state.tr));

        // try to replace the link using bad provider
        dispatch(
          queueCards([
            { url: href, pos: view.state.selection.from, appearance: 'inline' },
          ])(view.state.tr),
        );
      });

      it('does not replace if provider rejects', async () => {
        const { dispatch } = view;
        provider = new class implements CardProvider {
          resolve(url: string): Promise<any> {
            return Promise.reject('error');
          }
        }();

        dispatch(setProvider(provider)(view.state.tr));

        // try to replace the link using bad provider
        dispatch(
          queueCards([
            { url: href, pos: view.state.selection.from, appearance: 'inline' },
          ])(view.state.tr),
        );
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

    describe('changed document', () => {
      let promises: Promise<any>[] = [];
      let provider: CardMockProvider;

      beforeEach(() => {
        provider = new class implements CardProvider {
          resolve(url: string): Promise<any> {
            const promise = new Promise(resolve =>
              resolve({
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: 'hello world',
                  },
                ],
              }),
            );

            promises.push(promise);
            return promise;
          }
        }();
      });

      afterEach(() => {
        promises = [];
      });

      it('does not replace if link text changes', async () => {
        const href = 'http://www.sick.com/';
        const { editorView } = editor(
          doc(p('hello have a link ', a({ href })('{<>}' + href))),
        );

        const { dispatch } = editorView;
        dispatch(setProvider(provider)(editorView.state.tr));

        // queue it
        dispatch(
          queueCards([
            {
              url: href,
              pos: editorView.state.selection.from,
              appearance: 'inline',
            },
          ])(editorView.state.tr),
        );

        // now, change the link text (+1 so we change inside the text node with the mark, otherwise
        // we prefer to change on the other side of the boundary)
        insertText(editorView, 'change', editorView.state.selection.from + 1);

        await Promise.all(promises);

        // link should not have been replaced, but text will have changed
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p(
              'hello have a link ',
              a({ href })(href[0] + 'change{<>}' + href.slice(1)),
            ),
          ),
        );

        // queue should be empty
        expect(pluginKey.getState(editorView.state)).toEqual({
          requests: [],
          provider: provider,
        });
      });

      it('does not replace if position is some other content', async () => {
        const href = 'http://www.atlassian.com/';
        const initialDoc = doc(p('hello have a link '), p('{<>}' + href));

        const { editorView } = editor(initialDoc);
        const { dispatch } = editorView;
        dispatch(setProvider(provider)(editorView.state.tr));

        // queue a non-link node
        dispatch(
          queueCards([
            {
              url: href,
              pos: editorView.state.selection.from,
              appearance: 'inline',
            },
          ])(editorView.state.tr),
        );

        // resolve the provider
        await Promise.all(promises);

        // nothing should change
        expect(editorView.state.doc).toEqualDocument(initialDoc);
      });
    });
  });
});
