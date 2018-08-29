import { name } from '../../../../package.json';
import { mount } from 'enzyme';
import * as React from 'react';
import SizeDetector from '@atlaskit/size-detector';
import { Plugin } from 'prosemirror-state';
import { createEditor, doc, p } from '@atlaskit/editor-test-helpers';

import { pluginKey as widthPluginKey } from '../../../plugins/width';
import WidthDetector from '../../../ui/WidthDetector';

describe(name, () => {
  describe('WidthDetector', () => {
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
                        width = tr.getMeta(widthPluginKey);
                      },
                    },
                  }),
              },
            ],
          },
        ],
      });

      const wrapper = mount(<WidthDetector editorView={editorView} />);

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

      jest.runOnlyPendingTimers();

      expect(width).toBe(500);
      wrapper.unmount();
      editorView.destroy();
    });
  });
});
