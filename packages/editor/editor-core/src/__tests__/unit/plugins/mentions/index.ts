import createSandbox from 'jest-sandbox';
import { Node as PMNode } from 'prosemirror-model';
import { mention as mentionNode } from '@atlaskit/editor-common';
import {
  MentionsState,
  mentionPluginKey,
} from '../../../../plugins/mentions/pm-plugins/main';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  createEditor,
  sendKeyToPm,
  blockquote,
  br,
  doc,
  mention,
  mentionQuery,
  li,
  p,
  ul,
  code,
  insertText,
  createEvent,
  spyOnReturnValue,
} from '@atlaskit/editor-test-helpers';
import { mention as mentionData } from '@atlaskit/util-data-test';
import { analyticsService } from '../../../../analytics';
import * as keymaps from '../../../../keymaps';
import mentionsPlugin from '../../../../plugins/mentions';
import listPlugin from '../../../../plugins/lists';

const mentionProvider = new Promise<any>(resolve => {
  resolve(mentionData.storyData.resourceProvider);
});

describe('mentions', () => {
  const event = createEvent('event');
  let sandbox;
  const editor = (doc: any) =>
    createEditor<MentionsState>({
      doc,
      editorPlugins: [mentionsPlugin, listPlugin],
      providerFactory: ProviderFactory.create({ mentionProvider }),
      pluginKey: mentionPluginKey,
    });

  const forceUpdate = (pluginState, editorView: any) => {
    pluginState.apply(null, editorView.state);
    editorView.updateState(editorView.state);
  };

  beforeEach(function() {
    sandbox = createSandbox();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('keymap', () => {
    describe('ArrowUp', () => {
      it('should be ignored if there is no mentionProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = sandbox.spyOn(pluginState, 'onSelectPrevious');

        forceUpdate(pluginState, editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'ArrowUp');
        expect(spy).not.toHaveBeenCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = sandbox.spyOn(pluginState, 'onSelectPrevious');

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'ArrowUp');
          expect(spy).not.toHaveBeenCalled();
          editorView.destroy();
        });
      });

      it('should call "onSelectPrevious" which should return false by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'onSelectPrevious', sandbox);

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'ArrowUp');
          expect(spy).toHaveBeenCalled();
          expect(spy.returnValue).toBe(false);
          editorView.destroy();
        });
      });
    });

    describe('ArrowDown', () => {
      it('should be ignored if there is no mentionProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = sandbox.spyOn(pluginState, 'onSelectNext');

        forceUpdate(pluginState, editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'ArrowDown');
        expect(spy).not.toHaveBeenCalled();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = sandbox.spyOn(pluginState, 'onSelectNext');

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'ArrowDown');
          expect(spy).not.toHaveBeenCalled();
          editorView.destroy();
        });
      });

      it('should call "onSelectNext" which should return false by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'onSelectNext', sandbox);

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'ArrowDown');
          expect(spy).toHaveBeenCalled();
          expect(spy.returnValue).toBe(false);
          editorView.destroy();
        });
      });
    });

    describe('Enter', () => {
      it('should be ignored if there is no mentionProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = sandbox.spyOn(pluginState, 'onSelectCurrent');

        forceUpdate(pluginState, editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Enter');
        expect(spy).not.toHaveBeenCalledWith(keymaps.enter.common);
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = sandbox.spyOn(pluginState, 'onSelectCurrent');

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'Enter');
          expect(spy).not.toHaveBeenCalled();
          editorView.destroy();
        });
      });

      it('should call "onSelectCurrent" which should return false by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'onSelectCurrent');

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'Enter');
          expect(spy).toHaveBeenCalledWith(keymaps.enter.common);
          expect(spy.returnValue).toBe(false);
          editorView.destroy();
        });
      });
    });

    describe('Shift-Enter', () => {
      it('should be ignored if there is no mentionProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = sandbox.spyOn(pluginState, 'onSelectCurrent');

        forceUpdate(pluginState, editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy).not.toHaveBeenCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', async () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = sandbox.spyOn(pluginState, 'onSelectCurrent');

        await pluginState.setMentionProvider(mentionProvider);
        forceUpdate(pluginState, editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy).not.toHaveBeenCalled();
        editorView.destroy();
      });

      it('should call "onSelectCurrent"', async () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = sandbox.spyOn(pluginState, 'onSelectCurrent');

        await pluginState.setMentionProvider(mentionProvider);
        forceUpdate(pluginState, editorView); // Force update to ensure active query.

        sendKeyToPm(editorView, 'Shift-Enter');
        expect(spy).toHaveBeenCalledWith(keymaps.insertNewLine.common);
        editorView.destroy();
      });
    });

    describe('Space', () => {
      it('should be ignored if there is no mentionProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = sandbox.spyOn(pluginState, 'trySelectCurrent');

        forceUpdate(pluginState, editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Space');
        expect(spy).not.toHaveBeenCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = sandbox.spyOn(pluginState, 'trySelectCurrent');

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'Space');
          expect(spy).not.toHaveBeenCalled();
          editorView.destroy();
        });
      });

      it('should call "trySelectCurrent"', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@kai{<>}'))),
        );
        const spy = sandbox.spyOn(pluginState, 'trySelectCurrent');
        const trackEvent = jest.fn();
        analyticsService.trackEvent = trackEvent;

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'Space');
          expect(spy).toHaveBeenCalled();
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.fabric.mention.insert.auto',
            { match: false },
          );
          editorView.destroy();
        });
      });
    });

    describe('Escape', () => {
      it('should be ignored if there is no mentionProvider', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@o{<>}'))),
        );
        const spy = sandbox.spyOn(pluginState, 'dismiss');

        forceUpdate(pluginState, editorView); // Force update to ensure active query.
        sendKeyToPm(editorView, 'Esc');
        expect(spy).not.toHaveBeenCalled();
        editorView.destroy();
      });

      it('should be ignored if there is no active query', () => {
        const { editorView, pluginState } = editor(doc(p('Hello')));
        const spy = sandbox.spyOn(pluginState, 'dismiss');

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          sendKeyToPm(editorView, 'Esc');
          expect(spy).not.toHaveBeenCalled();
          editorView.destroy();
        });
      });

      it('should call "dismiss" which should return true by default', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@kai{<>}'))),
        );
        const spy = spyOnReturnValue(pluginState, 'dismiss', sandbox);
        const spyOnDismiss = spyOnReturnValue(
          pluginState,
          'onDismiss',
          sandbox,
        );

        return pluginState.setMentionProvider(mentionProvider).then(() => {
          forceUpdate(pluginState, editorView); // Force update to ensure active query.
          sendKeyToPm(editorView, 'Esc');
          expect(spy).toHaveBeenCalled();
          expect(spy.returnValue).toBe(true);
          expect(spyOnDismiss).toHaveBeenCalled();

          editorView.destroy();
        });
      });
    });
  });

  describe('insertMention', () => {
    it('should replace mention-query-mark with mention-node', () => {
      const { editorView, pluginState } = editor(doc(p(mentionQuery()('@os'))));

      pluginState.insertMention({
        name: 'Oscar Wallhult',
        mentionName: 'oscar',
        id: '1234',
      });

      expect((editorView.state.doc.nodeAt(1) as PMNode).type.spec).toEqual(
        mentionNode,
      );
      editorView.destroy();
    });

    it('should insert a space after the mention-node', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery()('@os{<>}'))),
      );

      pluginState.insertMention({
        name: 'Oscar Wallhult',
        mentionName: 'oscar',
        id: '1234',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            mention({
              text: '@Oscar Wallhult',
              id: '1234',
            })(),
            ' ',
          ),
        ),
      );
      editorView.destroy();
    });

    it('should not insert a space after the mention-node if next character is already a space', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery()('@os{<>}'), ' text')),
      );

      pluginState.insertMention({
        name: 'Oscar Wallhult',
        mentionName: 'oscar',
        id: '1234',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            mention({
              text: '@Oscar Wallhult',
              id: '1234',
            })(),
            ' text',
          ),
        ),
      );
      editorView.destroy();
    });

    it('should render the mention-node using a nickname if present', () => {
      const { editorView, pluginState } = editor(doc(p(mentionQuery()('@ta'))));

      pluginState.insertMention({
        name: 'Tara Tjandra',
        mentionName: 'ttjandra',
        nickname: 'tara',
        id: '1234',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            mention({
              text: '@tara',
              id: '1234',
            })(),
            ' ',
          ),
        ),
      );
      editorView.destroy();
    });

    it('should allow inserting multiple @-mentions next to eachother', () => {
      const { editorView, pluginState } = editor(
        doc(
          p(
            mention({ id: '1234', text: '@Oscar Wallhult' })(),
            ' ',
            mentionQuery()('@{<>}'),
          ),
        ),
      );

      pluginState.insertMention({
        name: 'Bradley Ayers',
        mentionName: 'brad',
        id: '5678',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            mention({
              text: '@Oscar Wallhult',
              id: '1234',
            })(),
            ' ',
            mention({
              text: '@Bradley Ayers',
              id: '5678',
            })(),
            ' ',
          ),
        ),
      );
      editorView.destroy();
    });

    it('should allow inserting @-mention on new line after hard break', () => {
      const { editorView, pluginState } = editor(
        doc(p(br(), mentionQuery()('@{<>}'))),
      );

      pluginState.insertMention({
        name: 'Oscar Wallhult',
        mentionName: 'oscar',
        id: '1234',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            br(),
            mention({
              id: '1234',
              text: '@Oscar Wallhult',
            })(),
            ' ',
          ),
        ),
      );
      editorView.destroy();
    });

    it('should not break list into two when inserting mention inside list item', () => {
      const { editorView, pluginState } = editor(
        doc(
          ul(
            li(p('One')),
            li(p('Two ', mentionQuery()('@{<>}'))),
            li(p('Three')),
          ),
        ),
      );

      pluginState.insertMention({
        name: 'Oscar Wallhult',
        mentionName: 'oscar',
        id: '1234',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          ul(
            li(p('One')),
            li(
              p(
                'Two ',
                mention({
                  id: '1234',
                  text: '@Oscar Wallhult',
                })(),
                ' ',
              ),
            ),
            li(p('Three')),
          ),
        ),
      );
      editorView.destroy();
    });

    it('should insert only 1 mention at a time inside blockqoute', () => {
      const { editorView, pluginState } = editor(
        doc(blockquote(p('Hello ', mentionQuery()('@{<>}')))),
      );

      pluginState.insertMention({
        name: 'Oscar Wallhult',
        mentionName: 'oscar',
        id: '1234',
      });

      expect(editorView.state.doc).toEqualDocument(
        doc(
          blockquote(
            p(
              'Hello ',
              mention({
                id: '1234',
                text: '@Oscar Wallhult',
              })(),
              ' ',
            ),
          ),
        ),
      );

      expect((editorView.state.doc.nodeAt(8) as PMNode).type.spec).toEqual(
        mentionNode,
      );
      expect(editorView.state.doc.nodeAt(10)).toBe(null);
      editorView.destroy();
    });

    it('should insert mention at the position of the provided inactive mark', () => {
      const { editorView, pluginState } = editor(
        doc(p('Hello ', mentionQuery({ active: false })('@os{<>}'), ' text')),
      );

      pluginState.insertMention(
        {
          name: 'Oscar Wallhult',
          mentionName: 'oscar',
          id: '1234',
        },
        {
          start: 7,
          end: 10,
        },
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'Hello ',
            mention({
              text: '@Oscar Wallhult',
              id: '1234',
            })(),
            ' text',
          ),
        ),
      );
      editorView.destroy();
    });

    it('should replace mention-query mark closest to selection', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery()('@os'), ' and ', mentionQuery()('@os{<>}'))),
      );

      pluginState.insertMention({
        name: 'Oscar Wallhult',
        mentionName: 'oscar',
        id: '1234',
      });

      expect((editorView.state.doc.nodeAt(9) as PMNode).type.spec).toEqual(
        mentionNode,
      );
      editorView.destroy();
    });

    it('should replace mention-query mark closest to selection ', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery()('@os{<>}'), mentionQuery()('@os'))),
      );

      pluginState.insertMention({
        name: 'Oscar Wallhult',
        mentionName: 'oscar',
        id: '1234',
      });

      expect((editorView.state.doc.nodeAt(1) as PMNode).type.spec).toEqual(
        mentionNode,
      );
      editorView.destroy();
    });
  });

  describe('remove', () => {
    it('should remove active mark when all text of mark is removed', () => {
      const { editorView } = editor(
        doc(p(mentionQuery({ active: true })('{<}@os{>}'))),
      );
      sendKeyToPm(editorView, 'Delete');
      expect(editorView.state.doc).toEqualDocument(doc(p()));
      editorView.destroy();
    });

    it('should call changeHandlers when mention is removed', () => {
      const spy = jest.fn();
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('{<}@os{>}'))),
      );
      pluginState.subscribe(spy);
      sendKeyToPm(editorView, 'Delete');
      expect(editorView.state.doc).toEqualDocument(doc(p()));
      expect(spy).toHaveBeenCalledTimes(1);
      editorView.destroy();
    });
  });

  describe('onMentionResult', () => {
    it('should not replace active mark ', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@os{<>}'))),
      );

      pluginState.onMentionResult(
        [
          {
            name: 'Oscar Wallhult',
            nickname: 'os',
            id: '1234',
          },
        ],
        'os',
      );

      expect(editorView.state.doc).toEqualDocument(
        doc(p(mentionQuery({ active: true })('@os{<>}'))),
      );
      editorView.destroy();
    });

    it('should not modify current selection when resolving', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: false })('@os', ' abcd{<>}'))),
      );

      pluginState.onMentionResult(
        [
          {
            name: 'Oscar Wallhult',
            nickname: 'os',
            id: '1234',
          },
        ],
        'os',
      );

      const newSelectionFrom = editorView.state.selection.from;
      expect(newSelectionFrom).toBe(9);
      editorView.destroy();
    });
  });

  describe('dismiss', () => {
    it('should remove active mark and keep text', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@os{<>}'))),
      );

      pluginState.dismiss();

      expect(editorView.state.doc).toEqualDocument(doc(p('@os')));
      editorView.destroy();
    });

    it('should remove stored mentions  mark', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@os{<>}'))),
      );

      pluginState.dismiss();

      expect(editorView.state.storedMarks).toBe(null);
      editorView.destroy();
    });
  });

  describe('isEnabled', () => {
    it('returns true when the mention mark can be applied', () => {
      const { editorView, pluginState } = editor(doc(p('te{<>}xt')));
      expect(pluginState.isEnabled()).toBe(true);
      editorView.destroy();
    });

    it('returns false when the mention mark cannot be applied', () => {
      const { editorView, pluginState } = editor(doc(p(code('te{<>}xt'))));
      expect(pluginState.isEnabled()).toBe(false);
      editorView.destroy();
    });
  });

  describe('trySelectCurrent', () => {
    it('should select current if there is only one result', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@O w{<>}'))),
      );
      const spy = sandbox.spyOn(pluginState, 'onSelectCurrent');

      return pluginState.setMentionProvider(mentionProvider).then(() => {
        forceUpdate(pluginState, editorView); // Force update to ensure active query.

        pluginState.onMentionResult(
          [
            {
              name: 'Oscar Wallhult',
              nickname: 'os',
              id: '1234',
            },
          ],
          'O w',
        );

        pluginState.trySelectCurrent(keymaps.space.common);

        expect(spy).toHaveBeenCalledWith(keymaps.space.common);
        editorView.destroy();
      });
    });

    it('should not select exact match if non unique', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@os{<>}'))),
      );
      const spy = sandbox.spyOn(pluginState, 'insertMention');

      return pluginState.setMentionProvider(mentionProvider).then(() => {
        forceUpdate(pluginState, editorView); // Force update to ensure active query.

        pluginState.onMentionResult(
          [
            {
              name: 'Oscar Wallhult',
              nickname: 'os',
              id: '1234',
            },
            {
              name: 'Oscar Wallhult 2',
              nickname: 'os',
              id: '666',
            },
          ],
          'os',
        );

        pluginState.trySelectCurrent();

        expect(spy).not.toHaveBeenCalled();
        editorView.destroy();
      });
    });

    it('should do nothing if the user is still searching (no exact match)', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@oscar{<>}'))),
      );

      return pluginState.setMentionProvider(mentionProvider).then(() => {
        forceUpdate(pluginState, editorView); // Force update to ensure active query.

        pluginState.onMentionResult(
          [
            {
              name: 'Oscar Wallhult',
              nickname: 'os',
              id: '1234',
            },
            {
              name: 'Oscar Wilde',
              id: '456',
            },
          ],
          'oscar',
        );

        expect(pluginState.trySelectCurrent()).toBe(false);
        editorView.destroy();
      });
    });

    it('should try inserting exact match for previous result if previous query has no result', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@oscar{<>}'))),
      );
      const spy = sandbox.spyOn(pluginState, 'tryInsertingPreviousMention');

      return pluginState.setMentionProvider(mentionProvider).then(() => {
        forceUpdate(pluginState, editorView); // Force update to ensure active query.

        pluginState.onMentionResult([], 'osc');

        pluginState.trySelectCurrent();

        expect(spy).toHaveBeenCalled();
        editorView.destroy();
      });
    });

    it('should try inserting exact match for previous result if no query in flight and no current result', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@oscar{<>}'))),
      );
      const spy = sandbox.spyOn(pluginState, 'tryInsertingPreviousMention');

      return pluginState.setMentionProvider(mentionProvider).then(() => {
        forceUpdate(pluginState, editorView); // Force update to ensure active query.

        pluginState.onMentionResult([], 'oscar');

        pluginState.trySelectCurrent();

        expect(spy).toHaveBeenCalled();
        editorView.destroy();
      });
    });

    it('should dismiss if there is no result and none coming', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@xyz{<>}'))),
      );
      const spy = sandbox.spyOn(pluginState, 'dismiss');

      return pluginState
        .setMentionProvider(mentionProvider)
        .then(mentionResource => {
          const trackEvent = jest.fn();
          analyticsService.trackEvent = trackEvent;
          const isFilteringStub = sandbox.spyOn(mentionResource, 'isFiltering');
          forceUpdate(pluginState, editorView); // Force update to ensure active query.

          isFilteringStub.mockImplementation(() => false);
          pluginState.onMentionResult([], 'xyz');

          pluginState.trySelectCurrent();

          expect(spy).toHaveBeenCalled();
          expect(trackEvent).toHaveBeenCalledWith(
            'atlassian.fabric.mention.insert.auto',
            { match: false },
          );
          editorView.destroy();
        });
    });
  });

  describe('Insert mention using previous exact match', () => {
    it('should insert mention if one previous query has exact match result', () => {
      const { editorView, pluginState } = editor(
        doc(p(mentionQuery({ active: true })('@oscar{<>}'))),
      );
      return pluginState.setMentionProvider(mentionProvider).then(() => {
        const trackEvent = jest.fn();
        analyticsService.trackEvent = trackEvent;
        forceUpdate(pluginState, editorView); // Force update to ensure active query.
        const userMention = {
          name: 'Oscar Wallhult',
          nickname: 'oscar',
          id: '1234',
        };
        pluginState.onMentionResult([userMention], 'oscar');

        sendKeyToPm(editorView, 'Space');
        insertText(editorView, ' How', editorView.state.selection.from);

        pluginState.onMentionResult([], 'oscar How');

        sendKeyToPm(editorView, 'Space');

        expect((editorView.state.doc.nodeAt(1) as PMNode).type.spec).toEqual(
          mentionNode,
        );
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.fabric.mention.insert.auto',
          { match: true },
        );
        editorView.destroy();
      });
    });
  });

  describe('focused', () => {
    describe('when editor is focused', () => {
      it('it is true', () => {
        const { plugin, pluginState, editorView } = editor(doc(p('te{<>}xt')));
        plugin.props.handleDOMEvents!.focus(editorView, event);
        expect(pluginState.focused).toEqual(true);
        editorView.destroy();
      });
    });

    describe('when editor is not focused', () => {
      it('it is false', () => {
        const { plugin, pluginState, editorView } = editor(doc(p('te{<>}xt')));
        plugin.props.handleDOMEvents!.blur(editorView, event);
        expect(pluginState.focused).toEqual(false);
        editorView.destroy();
      });
    });
  });

  describe('lastQuery', () => {
    describe('when state is cleared', () => {
      it('should store the previous query', () => {
        const { editorView, pluginState } = editor(
          doc(p(mentionQuery()('@joe{<>}'))),
        );
        pluginState!.query = 'joe';
        pluginState.dismiss();

        expect(pluginState!.lastQuery).toEqual('joe');
        expect(pluginState!.query).toEqual(undefined);
        editorView.destroy();
      });
    });
  });
});
