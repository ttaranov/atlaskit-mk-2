import { mount } from 'enzyme';
import * as React from 'react';
import * as sinon from 'sinon';
import emojiPlugins, { EmojiState } from '../../src/plugins/emojis';
import ToolbarEmojiPicker from '../../src/ui/ToolbarEmojiPicker';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import { doc, p, makeEditor, emoji } from '@atlaskit/editor-test-helpers';
import defaultSchema from '../../src/test-helper/schema';
import { testData as emojiTestData } from '@atlaskit/emoji/dist/es5/support';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji';
import ProviderFactory from '../../src/providerFactory';
import { analyticsService } from '../../src/analytics';
import pluginKey from '../../src/plugins/emojis/plugin-key';
import Popup from '../../src/ui/Popup';

const emojiProvider = emojiTestData.getEmojiResourcePromise();
const grinEmoji = emojiTestData.grinEmoji;
const grinEmojiId = {
  shortName: grinEmoji.shortName,
  id: grinEmoji.id,
  fallback: grinEmoji.fallback,
};

// TODO: Unskip this test in: https://product-fabric.atlassian.net/browse/ED-2201
describe.skip('@atlaskit/editor-core/ui/ToolbarEmojiPicker', () => {
  const editor = (doc: any) => makeEditor<EmojiState>({
    doc,
    plugins: emojiPlugins(defaultSchema, new ProviderFactory()),
  });

  it('should have Popup component defined in it', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(<ToolbarEmojiPicker pluginKey={pluginKey} emojiProvider={emojiProvider} editorView={editorView} numFollowingButtons={0}/>);
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    const popup = toolbarEmojiPicker.find(Popup);
    expect(popup.length > 0).toBe(true);
    toolbarEmojiPicker.unmount();
  });

  it('should have state variable isOpen set to true when toolbar emoji button is clicked', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(<ToolbarEmojiPicker pluginKey={pluginKey} emojiProvider={emojiProvider} editorView={editorView} numFollowingButtons={0}/>);
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    expect(toolbarEmojiPicker.state('isOpen')).toBe(true);
    toolbarEmojiPicker.unmount();
  });

  it('should render the picker if the button has been clicked once', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(<ToolbarEmojiPicker pluginKey={pluginKey} emojiProvider={emojiProvider} editorView={editorView} numFollowingButtons={0}/>);
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');

    expect(toolbarEmojiPicker.find(AkEmojiPicker).length).toBe(1);
    toolbarEmojiPicker.unmount();
  });

  it('should not render the picker if the button has not been clicked', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(<ToolbarEmojiPicker pluginKey={pluginKey} emojiProvider={emojiProvider} editorView={editorView} numFollowingButtons={0}/>);

    expect(toolbarEmojiPicker.find(AkEmojiPicker).length).toBe(0);
    toolbarEmojiPicker.unmount();
  });

  it('should have an onSelection handler in the rendered picker', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(<ToolbarEmojiPicker pluginKey={pluginKey} emojiProvider={emojiProvider} editorView={editorView} numFollowingButtons={0}/>);
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    const picker = toolbarEmojiPicker.find(AkEmojiPicker);
    expect(picker.prop('onSelection')).not.toBe(undefined);
    toolbarEmojiPicker.unmount();
  });

  it('should insert an emoji into editor if the picker registers a selection', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(<ToolbarEmojiPicker pluginKey={pluginKey} emojiProvider={emojiProvider} editorView={editorView} numFollowingButtons={0}/>);
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    const onSelection = toolbarEmojiPicker.find(AkEmojiPicker).prop('onSelection');
    onSelection!(grinEmojiId, grinEmoji);

    expect(editorView.state.doc).toEqual(
      doc(
        p(
          emoji(grinEmojiId),
          ' '
        )
      )
    );
    toolbarEmojiPicker.unmount();
  });

  it('should close the picker if an external node is clicked', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(<ToolbarEmojiPicker pluginKey={pluginKey} emojiProvider={emojiProvider} editorView={editorView} numFollowingButtons={0}/>);
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    toolbarEmojiPicker.find(EmojiIcon).parent().simulate('click');

    expect(toolbarEmojiPicker.state('isOpen')).toBe(false);
    toolbarEmojiPicker.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when emoji icon is clicked', () => {
      const trackEvent = sinon.spy();
      analyticsService.trackEvent = trackEvent;
      const { editorView } = editor(doc(p('')));
      const toolbarOption = mount(
        <ToolbarEmojiPicker
          pluginKey={pluginKey}
          emojiProvider={emojiProvider}
          editorView={editorView}
          numFollowingButtons={0}
        />
      );
      toolbarOption.find(EmojiIcon).simulate('click');
      expect(trackEvent.calledWith('atlassian.editor.emoji.button')).toBe(true);
      toolbarOption.unmount();
    });
  });

  it('should disable the ToolbarEmojiPicker when there in an active mention query mark', () => {
    const { editorView } = editor(doc(p('@')));
    const toolbarEmojiPicker = mount(<ToolbarEmojiPicker pluginKey={pluginKey} emojiProvider={emojiProvider} editorView={editorView} numFollowingButtons={0}/>);

    expect(toolbarEmojiPicker.prop('disabled')).toBe(true);
    toolbarEmojiPicker.unmount();
  });
});
