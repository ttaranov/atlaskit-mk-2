import { mount } from 'enzyme';
import * as React from 'react';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji';
import { emoji as emojiTestData } from '@atlaskit/util-data-test';
import { Popup, ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  createEditor,
  emoji,
  code_block,
} from '@atlaskit/editor-test-helpers';
import ToolbarEmojiPicker from '../../../../../plugins/emoji/ui/ToolbarEmojiPicker';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import {
  emojiPluginKey as pluginKey,
  EmojiState,
} from '../../../../../plugins/emoji/pm-plugins/main';
import emojiPlugin from '../../../../../plugins/emoji';
import codeBlockPlugin from '../../../../../plugins/code-block';
import mentionsPlugin from '../../../../../plugins/mentions';

const { testData } = emojiTestData;

const emojiProvider = testData.getEmojiResourcePromise();
const grinEmoji = testData.grinEmoji;
const grinEmojiId = {
  shortName: grinEmoji.shortName,
  id: grinEmoji.id,
  fallback: grinEmoji.fallback,
};

describe('@atlaskit/editor-core/ui/ToolbarEmojiPicker', () => {
  const providerFactory = ProviderFactory.create({ emojiProvider });
  const editor = (doc: any, analyticsHandler = () => {}) =>
    createEditor({
      doc,
      editorPlugins: [emojiPlugin, codeBlockPlugin(), mentionsPlugin()],
      editorProps: {
        analyticsHandler,
      },
      providerFactory: ProviderFactory.create({ emojiProvider }),
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

  it('should have state variable isOpen set to false when toolbar emoji button is opened, but then disabled', () => {
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
    const instance = toolbarEmojiPicker.instance() as any;
    const pluginState = pluginKey.getState(editorView.state) as EmojiState;
    pluginState.isEnabled = jest.fn().mockReturnValue(false);
    instance.handlePluginStateChange(pluginState);
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
      doc(p(emoji(grinEmojiId)(), ' ')),
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
      const { editorView } = editor(doc(p('')), trackEvent);
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
