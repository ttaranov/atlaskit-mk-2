import { mount } from 'enzyme';
import * as React from 'react';
import emojiPlugins, { EmojiState } from '../../src/plugins/emojis';
import ToolbarEmojiPicker from '../../src/ui/ToolbarEmojiPicker';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import {
  doc,
  p,
  makeEditor,
  emoji,
  code_block,
  mentionQuery,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import ToolbarButton from '../../src/ui/ToolbarButton';
import EditorWidth from '../../src/utils/editor-width';
import { testData as emojiTestData } from '@atlaskit/emoji/dist/es5/support';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji';
import { analyticsService } from '../../src/analytics';
import pluginKey from '../../src/plugins/emojis/plugin-key';
import { Popup, ProviderFactory } from '@atlaskit/editor-common';

const emojiProvider = emojiTestData.getEmojiResourcePromise();
const grinEmoji = emojiTestData.grinEmoji;
const grinEmojiId = {
  shortName: grinEmoji.shortName,
  id: grinEmoji.id,
  fallback: grinEmoji.fallback,
};

describe('@atlaskit/editor-core/ui/ToolbarEmojiPicker', () => {
  const providerFactory = ProviderFactory.create({ emojiProvider });
  const editor = (doc: any) =>
    makeEditor<EmojiState>({
      doc,
      plugins: emojiPlugins(defaultSchema, providerFactory),
    });

  let addSpy: jest.SpyInstance<any>;
  let removeSpy: jest.SpyInstance<any>;

  beforeEach(() => {
    addSpy = jest.spyOn(document, 'addEventListener');
    removeSpy = jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  afterAll(() => {
    providerFactory.destroy();
  });

  it('should have Popup component defined in it', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    const popup = toolbarEmojiPicker.find(Popup);
    expect(popup.length > 0).toEqual(true);
    toolbarEmojiPicker.unmount();
  });

  it('should return null if EditorWidth is less then BreakPoint4', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
        editorWidth={EditorWidth.BreakPoint4 - 1}
      />,
    );
    expect(toolbarEmojiPicker.html()).toEqual(null);
    toolbarEmojiPicker.unmount();
  });

  it('should be enabled by default', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    expect(toolbarEmojiPicker.state('disabled')).toEqual(false);
    toolbarEmojiPicker.unmount();
  });

  it('should disable the ToolbarEmojiPicker when in a code block', () => {
    const { editorView } = editor(doc(code_block()('<{}>')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    expect(toolbarEmojiPicker.state('disabled')).toEqual(true);
    toolbarEmojiPicker.unmount();
  });

  it('should disable the ToolbarEmojiPicker when in an active mention query mark', () => {
    const { editorView } = editor(doc(mentionQuery()('@')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    expect(toolbarEmojiPicker.state('disabled')).toEqual(true);
    toolbarEmojiPicker.unmount();
  });

  it('should be disabled if isDisabled property is true', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
        isDisabled
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to default', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
        editorWidth={EditorWidth.BreakPoint4 + 1}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual(
      'default',
    );
    toolbarOption.unmount();
  });

  it('should have state variable isOpen set to true when toolbar emoji button is clicked', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    expect(toolbarEmojiPicker.state('isOpen')).toEqual(true);
    toolbarEmojiPicker.unmount();
  });

  it('should have state variable isOpen set to false when toolbar emoji button is clicked twice', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    expect(toolbarEmojiPicker.state('isOpen')).toEqual(false);
    toolbarEmojiPicker.unmount();
  });

  it('should render the picker if the button has been clicked once', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');

    expect(toolbarEmojiPicker.find(AkEmojiPicker)).toHaveLength(1);
    toolbarEmojiPicker.unmount();
  });

  it('should not render the picker if the button has not been clicked', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );

    expect(toolbarEmojiPicker.find(AkEmojiPicker)).toHaveLength(0);
    toolbarEmojiPicker.unmount();
  });

  it('should have an onSelection handler in the rendered picker', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    const picker = toolbarEmojiPicker.find(AkEmojiPicker);
    expect(picker.prop('onSelection')).not.toEqual(undefined);
    toolbarEmojiPicker.unmount();
  });

  it('should insert an emoji into editor if the picker registers a selection', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    const onSelection = toolbarEmojiPicker
      .find(AkEmojiPicker)
      .prop('onSelection');
    onSelection!(grinEmojiId, grinEmoji);

    expect(editorView.state.doc).toEqualDocument(
      doc(p(emoji(grinEmojiId), ' ')),
    );
    toolbarEmojiPicker.unmount();
  });

  it('should close the picker if an external node is clicked', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    toolbarEmojiPicker.find(EmojiIcon).simulate('click');
    toolbarEmojiPicker
      .find(EmojiIcon)
      .parents()
      .at(0)
      .simulate('click');
    expect(toolbarEmojiPicker.state('isOpen')).toEqual(false);
    toolbarEmojiPicker.unmount();
  });

  it('should add an ESC keydown event listener on mount', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    const picker = toolbarEmojiPicker.instance() as ToolbarEmojiPicker;
    toolbarEmojiPicker.unmount();
    expect(addSpy).toHaveBeenCalled();
    expect(addSpy).toHaveBeenCalledWith('keydown', picker.handleEscape);
  });

  it('should remove an ESC keydown event listener on unmount', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    const picker = toolbarEmojiPicker.instance() as ToolbarEmojiPicker;
    toolbarEmojiPicker.unmount();
    expect(removeSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('keydown', picker.handleEscape);
  });

  it('should close the picker on handleEscape', () => {
    const { editorView } = editor(doc(p('')));
    const toolbarEmojiPicker = mount(
      <ToolbarEmojiPicker
        pluginKey={pluginKey}
        emojiProvider={emojiProvider}
        editorView={editorView}
        numFollowingButtons={0}
      />,
    );
    const picker = toolbarEmojiPicker.instance() as ToolbarEmojiPicker;
    picker.handleEscape({ keyCode: 27 });
    expect(toolbarEmojiPicker.find(AkEmojiPicker)).toHaveLength(0);
    toolbarEmojiPicker.unmount();
  });

  describe('analytics', () => {
    it('should trigger analyticsService.trackEvent when emoji is inserted via picker', () => {
      const trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
      const { editorView } = editor(doc(p('')));
      const toolbarEmojiPicker = mount(
        <ToolbarEmojiPicker
          pluginKey={pluginKey}
          emojiProvider={emojiProvider}
          editorView={editorView}
          numFollowingButtons={0}
        />,
      );
      toolbarEmojiPicker.find(EmojiIcon).simulate('click');
      const onSelection = toolbarEmojiPicker
        .find(AkEmojiPicker)
        .prop('onSelection');
      onSelection!(grinEmojiId, grinEmoji);

      expect(trackEvent).toHaveBeenCalledWith('atlassian.editor.emoji.button');
      toolbarEmojiPicker.unmount();
    });
  });
});
