import { floatingToolbar } from '../../../../plugins/card/toolbar';
import { IntlProvider } from 'react-intl';
import {
  createEditor,
  doc,
  p,
  inlineCard,
} from '@atlaskit/editor-test-helpers';
import { cardPlugin } from '../../../../plugins';
import { pluginKey } from '../../../../plugins/card/pm-plugins/main';

import commonMessages from '../../../../messages';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import OpenIcon from '@atlaskit/icon/glyph/open';
import { FloatingToolbarButton } from '../../../../plugins/floating-toolbar/types';
import { setNodeSelection } from '../../../../utils';
import { Command } from '../../../../types';

describe('card', () => {
  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorPlugins: [cardPlugin],
      pluginKey,
    });
  };

  describe('toolbar', () => {
    const intlProvider = new IntlProvider({ locale: 'en' });
    const { intl } = intlProvider.getChildContext();

    const visitTitle = intl.formatMessage(commonMessages.visit);
    const removeTitle = intl.formatMessage(commonMessages.remove);

    it('has a remove button', () => {
      const { editorView } = editor(doc(p()));

      const toolbar = floatingToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();
      const removeButton = toolbar!.items.find(
        item => item.type === 'button' && item.title === removeTitle,
      );

      expect(removeButton).toBeDefined();
      expect(removeButton).toMatchObject({
        appearance: 'danger',
        icon: RemoveIcon,
      });
    });

    it('has a visit button', () => {
      const { editorView } = editor(doc(p()));

      const toolbar = floatingToolbar(editorView.state, intl);
      expect(toolbar).toBeDefined();
      const visitButton = toolbar!.items.find(
        item => item.type === 'button' && item.title === visitTitle,
      );

      expect(visitButton).toBeDefined();
      expect(visitButton).toMatchObject({
        icon: OpenIcon,
      });
    });

    it('opens the url directly defined on an inline card', () => {
      // @ts-ignore
      global.open = jest.fn();

      const { editorView, refs } = editor(
        doc(
          p(
            '{<}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })('{>}'),
          ),
        ),
      );

      setNodeSelection(editorView, refs['<']);

      const toolbar = floatingToolbar(editorView.state, intl);
      const visitButton = toolbar!.items.find(
        item => item.type === 'button' && item.title === visitTitle,
      ) as FloatingToolbarButton<Command>;

      visitButton.onClick(editorView.state, editorView.dispatch);
      expect(open).toBeCalledWith('http://www.atlassian.com/');
    });

    it('opens the url directly via data on an inline card', () => {
      // @ts-ignore
      global.open = jest.fn();

      const { editorView, refs } = editor(
        doc(
          p(
            '{<}',
            inlineCard({
              data: {
                url: 'http://www.atlassian.com/',
              },
            })('{>}'),
          ),
        ),
      );

      setNodeSelection(editorView, refs['<']);

      const toolbar = floatingToolbar(editorView.state, intl);
      const visitButton = toolbar!.items.find(
        item => item.type === 'button' && item.title === visitTitle,
      ) as FloatingToolbarButton<Command>;

      visitButton.onClick(editorView.state, editorView.dispatch);
      expect(open).toBeCalledWith('http://www.atlassian.com/');
    });

    it('deletes an inline card', () => {
      const { editorView, refs } = editor(
        doc(
          p(
            'ab{<}',
            inlineCard({
              url: 'http://www.atlassian.com/',
            })('{>}'),
            'cd',
          ),
        ),
      );

      setNodeSelection(editorView, refs['<']);

      const toolbar = floatingToolbar(editorView.state, intl);
      const removeButton = toolbar!.items.find(
        item => item.type === 'button' && item.title === removeTitle,
      ) as FloatingToolbarButton<Command>;

      removeButton.onClick(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('abcd')));
    });
  });
});
