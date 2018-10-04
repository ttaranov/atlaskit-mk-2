import { name } from '../../../../package.json';
import { mount } from 'enzyme';
import * as React from 'react';
import { Plugin } from 'prosemirror-state';
import SizeDetector from '@atlaskit/size-detector';
import { createEditor, doc, p } from '@atlaskit/editor-test-helpers';
import { WidthProvider } from '@atlaskit/editor-common';

import {
  pluginKey as widthPluginKey,
  WidthPluginState,
} from '../../../plugins/width';
import WidthEmitter from '../../../ui/WidthEmitter';

describe(name, () => {
  describe('WidthBroadcaster', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should trigger a meta transaction with width', () => {
      let width;
      const { editorView } = createEditor({
        doc: doc(p()),
        editorPlugins: [
          {
            pmPlugins: () => [
              {
                rank: 1,
                plugin: () =>
                  new Plugin({
                    state: {
                      init: () => null,
                      apply(tr) {
                        const widthState = tr.getMeta(widthPluginKey) as
                          | WidthPluginState
                          | undefined;
                        width = widthState ? widthState.width : undefined;
                      },
                    },
                  }),
              },
            ],
          },
        ],
      });

      const wrapper = mount(
        <WidthProvider>
          <WidthEmitter editorView={editorView} />
        </WidthProvider>,
      );

      const elm = wrapper.find(SizeDetector).getDOMNode();
      /**
       * JSDOM doesn't support offsetWidth. Also we can't set it directly, it will throw with
       * TypeError: Cannot set property offsetWidth of [object Object] which has only a getter
       */
      Object.defineProperties(elm, {
        offsetWidth: {
          get: () => 500,
        },
      });

      const event = new Event('resize');
      window.dispatchEvent(event);
      // This is to trigger `requestAnimationFrame`. It's from `raf-stub` package that we are using inside `SizeDetector`
      (window.requestAnimationFrame as any).step();
      // This is to trigger `requestAnimationFrame`. It's from `raf-stub` package that we are using inside `WidthProvider`
      (window.requestAnimationFrame as any).step();

      jest.runOnlyPendingTimers();

      expect(width).toBe(500);
      wrapper.unmount();
      editorView.destroy();
    });
  });
});
