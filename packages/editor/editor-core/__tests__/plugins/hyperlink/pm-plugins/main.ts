import {
  stateKey as hyperlinkStateKey,
  HyperlinkState,
  InsertStatus,
  LinkAction,
} from '../../../../src/plugins/hyperlink/pm-plugins/main';
import {
  a,
  doc,
  createEditor,
  p,
  createEvent,
  insertText,
} from '@atlaskit/editor-test-helpers';
import { setTextSelection } from '../../../../src/utils';

describe('hyperlink', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      pluginKey: hyperlinkStateKey,
    });
  };

  const event = createEvent('event');

  describe('plugin', () => {
    describe('#state.init', () => {
      it('should set isEditorFocused to true', () => {
        const { editorView, plugin } = editor(doc(p('paragraph{<>}')));
        const pluginState = plugin.spec.state.init({}, editorView.state);
        expect(pluginState.isEditorFocused).toBe(true);
      });

      it('should show edit link toolbar if initial selection is inside a link', () => {
        const { editorView, plugin } = editor(
          doc(p(a({ href: 'https://google.com' })('Li{<>}nk'))),
        );
        const pluginState = plugin.spec.state.init(
          {},
          editorView.state,
        ) as HyperlinkState;
        expect(pluginState).toEqual(
          expect.objectContaining({
            activeLinkMark: {
              type: InsertStatus.EDIT_LINK_TOOLBAR,
              node: editorView.state.doc.nodeAt(1),
              pos: 1,
            },
          } as HyperlinkState),
        );
      });

      it('should not show edit link toolbar if initial selection is outside a link', () => {
        const { editorView, plugin } = editor(doc(p('paragraph{<>}')));
        const pluginState = plugin.spec.state.init({}, editorView.state);
        expect(pluginState.activeLinkMark).toBeUndefined();
      });
    });

    describe('#state.update', () => {
      describe('when cursor is outside a link', () => {
        it('shows the edit link toolbar when cursor is placed inside a link', () => {
          const {
            refs: { linkPos },
            editorView,
          } = editor(
            doc(p('para{<>}graph', a({ href: 'google.com' })('lin{linkPos}k'))),
          );

          setTextSelection(editorView, linkPos);
          const pluginState = hyperlinkStateKey.getState(editorView.state);
          expect(pluginState).toEqual(
            expect.objectContaining({
              activeLinkMark: {
                type: InsertStatus.EDIT_LINK_TOOLBAR,
                node: editorView.state.doc.nodeAt(10),
                pos: 10,
              },
            } as HyperlinkState),
          );
        });

        it('shows the insert link toolbar when SHOW_INSERT_TOOLBAR action triggered', () => {
          const { editorView } = editor(doc(p('para{<>}graph')));

          editorView.dispatch(
            editorView.state.tr.setMeta(
              hyperlinkStateKey,
              LinkAction.SHOW_INSERT_TOOLBAR,
            ),
          );
          const pluginState = hyperlinkStateKey.getState(editorView.state);
          expect(pluginState).toEqual(
            expect.objectContaining({
              activeLinkMark: {
                type: InsertStatus.INSERT_LINK_TOOLBAR,
                from: 5,
                to: 5,
              },
            } as HyperlinkState),
          );
        });

        it('hides the insert link toolbar when HIDE_TOOLBAR action triggered', () => {
          const { editorView } = editor(doc(p('para{<>}graph')));

          editorView.dispatch(
            editorView.state.tr.setMeta(
              hyperlinkStateKey,
              LinkAction.SHOW_INSERT_TOOLBAR,
            ),
          );
          let pluginState = hyperlinkStateKey.getState(editorView.state);
          expect(pluginState.activeLinkMark).toBeDefined();

          editorView.dispatch(
            editorView.state.tr.setMeta(
              hyperlinkStateKey,
              LinkAction.HIDE_TOOLBAR,
            ),
          );
          pluginState = hyperlinkStateKey.getState(editorView.state);
          expect(pluginState.activeLinkMark).toBeUndefined();
        });

        describe('when selection is across multiple nodes', () => {
          it('should not show the insert link toolbar when SHOW_INSERT_TOOLBAR action triggered', () => {
            const { editorView } = editor(
              doc(p('para{<}graph'), p('para{>}graph')),
            );

            editorView.dispatch(
              editorView.state.tr.setMeta(
                hyperlinkStateKey,
                LinkAction.SHOW_INSERT_TOOLBAR,
              ),
            );
            const pluginState = hyperlinkStateKey.getState(editorView.state);
            expect(pluginState).toEqual(
              expect.objectContaining({
                activeLinkMark: undefined,
              } as HyperlinkState),
            );
          });
        });
      });

      describe('when cursor is inside a link', () => {
        describe('when edit link toolbar is shown', () => {
          it('should hide toolbar when HIDE_TOOLBAR action triggered', () => {
            const { editorView } = editor(
              doc(p(a({ href: 'https://google.com' })('Li{<>}nk'))),
            );
            let pluginState = hyperlinkStateKey.getState(editorView.state);
            expect(pluginState.activeLinkMark).toBeDefined();

            editorView.dispatch(
              editorView.state.tr.setMeta(
                hyperlinkStateKey,
                LinkAction.HIDE_TOOLBAR,
              ),
            );
            pluginState = hyperlinkStateKey.getState(editorView.state);
            expect(pluginState.activeLinkMark).toBeUndefined();
          });

          it('should update toolbar pos/node when document changed externally', () => {
            const { editorView } = editor(
              doc(p(a({ href: 'https://google.com' })('Li{<>}nk'))),
            );
            let pluginState = hyperlinkStateKey.getState(editorView.state);

            insertText(editorView, 'prefix', 1);
            pluginState = hyperlinkStateKey.getState(editorView.state);
            expect(pluginState).toEqual(
              expect.objectContaining({
                activeLinkMark: {
                  type: InsertStatus.EDIT_LINK_TOOLBAR,
                  pos: 7,
                  node: editorView.state.doc.nodeAt(7),
                },
              } as HyperlinkState),
            );
          });
        });

        describe('when cursor moves to a different link', () => {
          it('should update the edit link toolbar node & pos', () => {
            const {
              refs: { linkPos },
              editorView,
            } = editor(
              doc(
                p(
                  a({ href: 'google.com' })('st{<>}art'),
                  ' ',
                  a({ href: 'example.com' })('e{linkPos}nd'),
                ),
              ),
            );

            let pluginState = hyperlinkStateKey.getState(editorView.state);
            expect(pluginState.activeLinkMark).toBeDefined();

            setTextSelection(editorView, linkPos);

            pluginState = hyperlinkStateKey.getState(editorView.state);
            expect(pluginState).toEqual(
              expect.objectContaining({
                activeLinkMark: {
                  type: InsertStatus.EDIT_LINK_TOOLBAR,
                  node: editorView.state.doc.nodeAt(7),
                  pos: 7,
                },
              } as HyperlinkState),
            );
          });
        });

        describe('when cursor moves within the same link', () => {
          it('should not update state', () => {
            const {
              refs: { linkPos },
              pluginState,
              editorView,
            } = editor(doc(p(a({ href: 'google.com' })('l{<>}in{linkPos}k'))));

            setTextSelection(editorView, linkPos);
            // Should change this to `toBe`
            expect(hyperlinkStateKey.getState(editorView.state)).toEqual(
              pluginState,
            );
          });
        });

        describe('when cursor moves outside the link', () => {
          it('should unset the activeLinkMark', () => {
            const {
              refs: { pPos },
              editorView,
            } = editor(
              doc(p('paragraph{pPos}', a({ href: 'google.com' })('lin{<>}k'))),
            );

            expect(
              hyperlinkStateKey.getState(editorView.state).activeLinkMark,
            ).toBeDefined();
            setTextSelection(editorView, pPos);

            expect(
              hyperlinkStateKey.getState(editorView.state).activeLinkMark,
            ).toBeUndefined();
          });
        });
      });

      describe('when cursor at the end of the link', () => {
        it('should set no active link mark', () => {
          const { pluginState } = editor(
            doc(p(a({ href: 'google.com' })('link{<>}'))),
          );
          expect(pluginState).toBeUndefined;
        });
      });

      describe('when cursor at the beginning of the link', () => {
        it('should set no active link mark', () => {
          const { pluginState } = editor(
            doc(p(a({ href: 'google.com' })('{<>}link'))),
          );
          expect(pluginState).toBeUndefined;
        });
      });

      describe('when cursor at the middle of the link', () => {
        it('should set active element pos immediately before the link', () => {
          const { pluginState } = editor(
            doc(p(a({ href: 'google.com' })('li{<>}nk'))),
          );

          expect(pluginState.activeLinkMark.pos).toBe(1);
        });
      });

      it('should not show the edit toolbar when there is a selection across the link', () => {
        const { pluginState } = editor(
          doc(p(a({ href: 'google.com' })('{<}link{>}'))),
        );
        expect(pluginState.activeLinkMark).toBeUndefined();
      });
    });
  });

  describe('isEditorFocused', () => {
    it('should set to `true` when a focus event fires', () => {
      const { plugin, editorView } = editor(doc(p('{<>}')));
      plugin.props.handleDOMEvents!.blur(editorView, event);
      plugin.props.handleDOMEvents!.focus(editorView, event);

      const pluginState = hyperlinkStateKey.getState(editorView.state);
      expect(pluginState.isEditorFocused).toBe(true);
    });

    it('should set to `false` when a blur event fires', () => {
      const { plugin, editorView } = editor(doc(p('{<>}')));

      plugin.props.handleDOMEvents!.blur(editorView, event);

      const pluginState = hyperlinkStateKey.getState(editorView.state);
      expect(pluginState.isEditorFocused).toBe(false);
    });

    it('should set to `true` when a click event fires and editor is not focused', () => {
      const { plugin, editorView } = editor(doc(p('{<>}')));

      jest.spyOn(editorView, 'hasFocus').mockReturnValue(true);
      plugin.props.handleDOMEvents!.blur(editorView, event);
      plugin.props.handleDOMEvents!.click(editorView, event);

      const pluginState = hyperlinkStateKey.getState(editorView.state);
      expect(pluginState.isEditorFocused).toBe(true);
    });
  });
});
