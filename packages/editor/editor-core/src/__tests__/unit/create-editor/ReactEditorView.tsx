import { name } from '../../../../package.json';
import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { TextSelection } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  mediaGroup,
  media,
  defaultSchema,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';
import ReactEditorView from '../../../create-editor/ReactEditorView';
import { toJSON } from '../../../utils';
import {
  patchEditorViewForJSDOM,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import { EventDispatcher } from '../../../event-dispatcher';

const portalProviderAPI: any = {
  render() {},
  remove() {},
};

describe(name, () => {
  describe('<ReactEditorView />', () => {
    it('should place the initial selection at the end of the document', () => {
      const document = doc(p('hello{endPos}'))(defaultSchema);
      const wrapper = shallow(
        <ReactEditorView
          editorProps={{ defaultValue: toJSON(document) }}
          providerFactory={new ProviderFactory()}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );
      const { editorState } = wrapper.instance() as ReactEditorView;
      const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
      expect(cursorPos).toEqual(document.refs.endPos);
      wrapper.unmount();
    });

    it('should place the initial selection at the start of the document when in full-page appearance', () => {
      const document = doc(p('{startPos}hello'))(defaultSchema);
      const wrapper = shallow(
        <ReactEditorView
          editorProps={{
            defaultValue: toJSON(document),
            appearance: 'full-page',
          }}
          providerFactory={new ProviderFactory()}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );
      const { editorState } = wrapper.instance() as ReactEditorView;
      const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
      expect(cursorPos).toEqual(document.refs.startPos);
      wrapper.unmount();
    });

    it('should place the initial selection at the start/end when document is empty', () => {
      const document = doc(p('{endPos}'))(defaultSchema);
      const wrapper = shallow(
        <ReactEditorView
          editorProps={{}}
          providerFactory={new ProviderFactory()}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );
      const { editorState } = wrapper.instance() as ReactEditorView;
      const cursorPos = (editorState.selection as TextSelection).$cursor!.pos;
      expect(cursorPos).toEqual(document.refs.endPos);
      wrapper.unmount();
    });

    it('should place the initial selection near the end if a valid selection at the end does not exist', () => {
      // See ED-3507
      const mediaNode = media({ id: '1', type: 'file', collection: '2' });
      const document = doc(p('Start'), mediaGroup(mediaNode()))(defaultSchema);
      const mediaProvider = storyMediaProviderFactory();
      const wrapper = shallow(
        <ReactEditorView
          editorProps={{
            defaultValue: toJSON(document),
            media: { provider: mediaProvider },
          }}
          providerFactory={ProviderFactory.create({ mediaProvider })}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );
      const { editorState } = wrapper.instance() as ReactEditorView;
      const selectionAtEndOfDocument = TextSelection.atEnd(editorState.doc);
      expect(editorState.selection.eq(selectionAtEndOfDocument)).toBe(false);
      expect(editorState.selection.toJSON()).toEqual({
        head: 6,
        anchor: 6,
        type: 'text',
      });
      wrapper.unmount();
    });

    it("should set `key` on the ProseMirror div node to aid React's reconciler", () => {
      const wrapper = mount(
        <ReactEditorView
          editorProps={{}}
          providerFactory={ProviderFactory.create({})}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );

      expect(wrapper.children().key()).toEqual('ProseMirror');
      wrapper.unmount();
    });

    describe('when a transaction is dispatched', () => {
      it('should not trigger a re-render', () => {
        const wrapper = mountWithIntl(
          <ReactEditorView
            editorProps={{}}
            providerFactory={ProviderFactory.create({})}
            portalProviderAPI={portalProviderAPI}
            onEditorCreated={() => {}}
            onEditorDestroyed={() => {}}
          />,
        );

        const editor = wrapper.instance() as ReactEditorView;
        patchEditorViewForJSDOM(editor.view);

        const renderSpy = jest.spyOn(editor, 'render');
        editor.view!.dispatch(editor.view!.state.tr);

        expect(renderSpy).toHaveBeenCalledTimes(0);
        wrapper.unmount();
      });
    });

    it('should call onEditorCreated once the editor is initialised', () => {
      let handleEditorCreated = jest.fn();
      let wrapper = mount(
        <ReactEditorView
          editorProps={{ appearance: 'message' }}
          providerFactory={new ProviderFactory()}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={handleEditorCreated}
          onEditorDestroyed={() => {}}
        />,
      );

      expect(handleEditorCreated).toHaveBeenCalledTimes(1);
      expect(handleEditorCreated).toHaveBeenCalledWith({
        view: expect.any(EditorView),
        eventDispatcher: expect.any(EventDispatcher),
        config: {
          contentComponents: expect.anything(),
          marks: expect.anything(),
          nodes: expect.anything(),
          pmPlugins: expect.anything(),
          primaryToolbarComponents: expect.anything(),
          secondaryToolbarComponents: expect.anything(),
        },
      });
      wrapper.unmount();
    });

    it('should call onEditorDestroyed when the editor is unmounting', () => {
      let handleEditorDestroyed = jest.fn();
      const wrapper = mount(
        <ReactEditorView
          editorProps={{ appearance: 'message' }}
          providerFactory={new ProviderFactory()}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={() => {}}
          onEditorDestroyed={handleEditorDestroyed}
        />,
      );
      wrapper.unmount();

      expect(handleEditorDestroyed).toHaveBeenCalledTimes(1);
      expect(handleEditorDestroyed).toHaveBeenCalledWith({
        view: expect.any(EditorView),
        eventDispatcher: expect.any(EventDispatcher),
        config: {
          contentComponents: expect.anything(),
          marks: expect.anything(),
          nodes: expect.anything(),
          pmPlugins: expect.anything(),
          primaryToolbarComponents: expect.anything(),
          secondaryToolbarComponents: expect.anything(),
        },
      });
    });

    it('should call destroy() on plugin states when it gets unmounted', () => {
      let spies;
      const mediaProvider = storyMediaProviderFactory({
        includeUserAuthProvider: true,
      });
      const wrapper = mount(
        <ReactEditorView
          editorProps={{
            mediaProvider: mediaProvider,
          }}
          providerFactory={ProviderFactory.create({ mediaProvider })}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={({ view }) => {
            spies = view.state.plugins
              .map(plugin => plugin.getState(view.state))
              .filter(state => !!state && !!state.destroy)
              .map(state => jest.spyOn(state, 'destroy'));
          }}
          onEditorDestroyed={() => {}}
        />,
      );

      expect(spies.length).toBeGreaterThan(0);
      wrapper.unmount();

      spies.forEach(spy => expect(spy).toHaveBeenCalledTimes(1));
    });

    it('should call destroy() on EventDispatcher when it gets unmounted', () => {
      let eventDispatcherDestroySpy;
      const wrapper = mount(
        <ReactEditorView
          editorProps={{}}
          providerFactory={new ProviderFactory()}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={({ eventDispatcher }) => {
            eventDispatcherDestroySpy = jest.spyOn(eventDispatcher, 'destroy');
          }}
          onEditorDestroyed={() => {}}
        />,
      );
      wrapper.unmount();
      expect(eventDispatcherDestroySpy).toHaveBeenCalledTimes(1);
    });

    it('should disable grammarly in the editor', () => {
      const wrapper = mount(
        <ReactEditorView
          editorProps={{}}
          providerFactory={ProviderFactory.create({})}
          portalProviderAPI={portalProviderAPI}
          onEditorCreated={() => {}}
          onEditorDestroyed={() => {}}
        />,
      );
      const editorDOM = (wrapper.instance() as ReactEditorView).view!.dom;
      expect(editorDOM.getAttribute('data-gramm')).toBe('false');
      wrapper.unmount();
    });

    describe('when re-creating the editor view after a props change', () => {
      it('should call onEditorDestroyed', () => {
        let handleEditorDestroyed = jest.fn();
        const wrapper = mount(
          <ReactEditorView
            editorProps={{ appearance: 'message' }}
            providerFactory={new ProviderFactory()}
            portalProviderAPI={portalProviderAPI}
            onEditorCreated={() => {}}
            onEditorDestroyed={handleEditorDestroyed}
          />,
        );

        // Force a re-mount of the editor-view by changing the React tree
        wrapper.setProps({ render: ({ editor }) => <div>{editor}</div> });

        expect(handleEditorDestroyed).toHaveBeenCalledTimes(1);
        expect(handleEditorDestroyed).toHaveBeenCalledWith({
          view: expect.any(EditorView),
          eventDispatcher: expect.any(EventDispatcher),
          config: {
            contentComponents: expect.anything(),
            marks: expect.anything(),
            nodes: expect.anything(),
            pmPlugins: expect.anything(),
            primaryToolbarComponents: expect.anything(),
            secondaryToolbarComponents: expect.anything(),
          },
        });
      });

      it('should call destroy on the old EditorView', () => {
        let editorViewDestroy;
        const wrapper = mount(
          <ReactEditorView
            editorProps={{}}
            providerFactory={new ProviderFactory()}
            portalProviderAPI={portalProviderAPI}
            onEditorCreated={({ view }) => {
              // So we don't accidently re-set this when we create the new editor view
              if (!editorViewDestroy) {
                editorViewDestroy = jest.spyOn(view, 'destroy');
              }
            }}
            onEditorDestroyed={() => {}}
          />,
        );

        // Force a re-mount of the editor-view by changing the React tree
        wrapper.setProps({ render: ({ editor }) => <div>{editor}</div> });

        expect(editorViewDestroy).toHaveBeenCalled();
      });

      it('should call onEditorCreated with the new EditorView', () => {
        let oldEditorView;
        let newEditorView;
        const wrapper = mount(
          <ReactEditorView
            editorProps={{}}
            providerFactory={new ProviderFactory()}
            portalProviderAPI={portalProviderAPI}
            onEditorCreated={({ view }) => {
              newEditorView = view;
            }}
            onEditorDestroyed={({ view }) => {
              oldEditorView = view;
            }}
          />,
        );

        // Force a re-mount of the editor-view by changing the React tree
        wrapper.setProps({ render: ({ editor }) => <div>{editor}</div> });

        expect(newEditorView).toBeInstanceOf(EditorView);
        expect(oldEditorView).not.toBe(newEditorView);
      });

      it('should not re-create the event dispatcher', () => {
        let oldEventDispatcher;
        let eventDispatcherDestroySpy;
        const wrapper = mount(
          <ReactEditorView
            editorProps={{}}
            providerFactory={new ProviderFactory()}
            portalProviderAPI={portalProviderAPI}
            onEditorCreated={({ eventDispatcher }) => {
              // So we don't accidently re-set this when we create the new editor view
              if (!oldEventDispatcher) {
                oldEventDispatcher = eventDispatcher;
                eventDispatcherDestroySpy = jest.spyOn(
                  eventDispatcher,
                  'destroy',
                );
              }
            }}
            onEditorDestroyed={() => {}}
          />,
        );

        // Force a re-mount of the editor-view by changing the React tree
        wrapper.setProps({ render: ({ editor }) => <div>{editor}</div> });

        expect(oldEventDispatcher).toBe(
          (wrapper.instance() as ReactEditorView).eventDispatcher,
        );
        expect(eventDispatcherDestroySpy).not.toHaveBeenCalled();
      });
    });
  });
});
