import { name } from '../../../../package.json';
import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';
import WithPluginState from '../../../../src/editor/ui/WithPluginState';
import { EventDispatcher } from '../../../../src/editor/event-dispatcher';
import { makeEditor, doc, p } from '../../../../src/test-helper';
import { Plugin, PluginKey } from 'prosemirror-state';

describe(name, () => {
  const editor = (doc: any, plugin: Plugin) => makeEditor({
    doc,
    plugins: [plugin]
  });
  const pluginKey = new PluginKey('plugin');
  const createPlugin = (state, key?) => {
    return new Plugin({
      key: key || pluginKey,
      state: {
        init() {
          return state;
        },
        apply() {
          return state;
        }
      }
    });
  };

  let eventDispatcher;
  beforeEach(() => {
    eventDispatcher = new EventDispatcher();
  });

  describe('WithPluginState', () => {
    it('should call render with current plugin state', () => {
      const pluginState = {};
      const plugin = createPlugin(pluginState);
      const { editorView } = editor(doc(p()), plugin);
      const wrapper = mount(<WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ currentPluginState: pluginKey }}
        // tslint:disable-next-line:jsx-no-lambda
        render={({ currentPluginState }) => {
          expect(currentPluginState).to.eq(pluginState);
          return null;
        }}
      />);
      wrapper.unmount();
      editorView.destroy();
    });
  });
});
