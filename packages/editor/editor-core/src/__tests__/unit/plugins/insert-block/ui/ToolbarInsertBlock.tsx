import * as React from 'react';
import Item from '@atlaskit/item';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji';
import { emoji as emojiData } from '@atlaskit/util-data-test';
import {
  doc,
  p,
  createEditor,
  code_block,
  decisionList,
  decisionItem,
  mountWithIntlContext,
} from '@atlaskit/editor-test-helpers';
import { ProviderFactory, uuid, messages } from '@atlaskit/editor-common';

import { pluginKey as blockTypePluginKey } from '../../../../../plugins/block-type/pm-plugins/main';
import DropdownMenu from '../../../../../ui/DropdownMenu';
import ToolbarInsertBlock from '../../../../../plugins/insert-block/ui/ToolbarInsertBlock';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import EditorActions from '../../../../../actions';
import { MediaProvider } from '../../../../../plugins/media';

const emojiProvider = emojiData.testData.getEmojiResourcePromise();

const mediaProvider: Promise<MediaProvider> = Promise.resolve({
  viewContext: Promise.resolve({} as any),
  uploadContext: Promise.resolve({} as any),
});

const providerFactory = ProviderFactory.create({ mediaProvider });

describe('@atlaskit/editor-core/ui/ToolbarInsertBlock', () => {
  let trackEvent;
  let editorActions;

  const editor = (doc: any) =>
    createEditor({
      doc,
      pluginKey: blockTypePluginKey,
      editorProps: {
        analyticsHandler: trackEvent,
        allowCodeBlocks: true,
        allowLayouts: true,
        allowLists: true,
        allowPanel: true,
        allowTasksAndDecisions: true,
      },
      providerFactory,
    });

  beforeEach(() => {
    trackEvent = jest.fn();
    editorActions = new EditorActions();
  });

  it('should render disabled DropdownMenu trigger if isDisabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));

    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        tableSupported={true}
        editorView={editorView}
        availableWrapperBlockTypes={pluginState.availableWrapperBlockTypes}
        isDisabled={true}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('disabled')).toEqual(true);
    toolbarOption.unmount();
  });

  it('should return null if none of the plugins are present', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        editorView={editorView}
        buttons={5}
        isReducedSpacing={false}
      />,
    );
    expect(toolbarOption.html()).toEqual(null);
    toolbarOption.unmount();
  });

  // Following test case is breaking due to trouble in @atlaskit/downdown.
  // isDisabled is always set to false.
  it('should disable mention option if mentionsEnabled is false', () => {
    const { editorView } = editor(
      doc(code_block({ language: 'js' })('te{<>}xt')),
    );
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        mentionsSupported={true}
        mentionsEnabled={false}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const mentionButton = toolbarOption.find(Item).filterWhere(n => {
      return n.html().indexOf(messages.mention.defaultMessage) >= 0;
    });
    expect(mentionButton.prop('isDisabled')).toEqual(true);
    toolbarOption.unmount();
  });

  it('should close emoji picker when dropdown is toggled', () => {
    const { editorView } = editor(doc(p()));
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        emojiDisabled={false}
        emojiProvider={emojiProvider}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption
      .filterWhere(
        n => n.html().indexOf(messages.insert_menu.defaultMessage) >= 0,
      )
      .simulate('click');
    toolbarOption.find('button').simulate('click');
    expect(toolbarOption.state('emojiPickerOpen')).toEqual(false);
    toolbarOption.unmount();
  });

  it('should open emoji picker when emoji option is clicked', () => {
    const { editorView } = editor(doc(p()));
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        emojiDisabled={false}
        emojiProvider={emojiProvider}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const mediaButton = toolbarOption
      .find('Item')
      .filterWhere(n => n.html().indexOf(messages.emoji.defaultMessage) >= 0);
    mediaButton.simulate('click');
    expect(toolbarOption.state('emojiPickerOpen')).toEqual(true);
    toolbarOption.unmount();
  });

  it('should have emoji picker component when emojiPickerOpen is true', () => {
    const { editorView } = editor(doc(p()));
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        emojiDisabled={false}
        emojiProvider={emojiProvider}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.setState({ emojiPickerOpen: true });
    expect(toolbarOption.find(AkEmojiPicker).length).toEqual(1);
    toolbarOption.unmount();
  });

  it('should have 1 child elements if mediaSupported and mediaUploadsEnabled is defined and equals true', async () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        mediaSupported={true}
        mediaUploadsEnabled={true}
        editorView={editorView}
        buttons={5}
        isReducedSpacing={false}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).length).toEqual(1);
    toolbarOption.unmount();
  });

  it('should call onShowMediaPicker when media option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const spy = jest.fn();
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        mediaSupported={true}
        mediaUploadsEnabled={true}
        onShowMediaPicker={spy}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const mediaButton = toolbarOption
      .find('Item')
      .filterWhere(
        n => n.text().indexOf(messages.file_images.defaultMessage) >= 0,
      );
    mediaButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.media.button',
    );
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when Panel option is clicked', () => {
    const { editorView, pluginState: pluginStateBlockType } = editor(
      doc(p('text')),
    );
    const spy = jest.fn(blockType => {
      return () => {
        return true;
      };
    });

    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={
          pluginStateBlockType.availableWrapperBlockTypes
        }
        onInsertBlockType={spy}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const panelButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf(messages.panel.defaultMessage) >= 0);
    panelButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('panel');
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.panel.button',
    );
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when code block option is clicked', () => {
    const { editorView, pluginState: pluginStateBlockType } = editor(
      doc(p('text')),
    );
    const spy = jest.fn(blockType => {
      return () => {
        return true;
      };
    });

    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={
          pluginStateBlockType.availableWrapperBlockTypes
        }
        onInsertBlockType={spy}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const codeblockButton = toolbarOption
      .find(Item)
      .filterWhere(
        n => n.text().indexOf(messages.codeblock.defaultMessage) >= 0,
      );
    codeblockButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('codeblock');
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.codeblock.button',
    );
    toolbarOption.unmount();
  });

  it('should trigger insertBlockType when blockquote option is clicked', () => {
    const { editorView, pluginState: pluginStateBlockType } = editor(
      doc(p('text')),
    );
    const spy = jest.fn(blockType => {
      return () => {
        return true;
      };
    });

    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        availableWrapperBlockTypes={
          pluginStateBlockType.availableWrapperBlockTypes
        }
        onInsertBlockType={spy}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const blockquoteButton = toolbarOption
      .find(Item)
      .filterWhere(
        n => n.text().indexOf(messages.blockquote.defaultMessage) >= 0,
      );

    blockquoteButton.simulate('click');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('blockquote');
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.blockquote.button',
    );
    toolbarOption.unmount();
  });

  it('should insert decision when decision option is clicked', () => {
    uuid.setStatic('local-highlight');
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        decisionSupported={true}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const decisionButton = toolbarOption
      .find(Item)
      .filterWhere(
        n => n.text().indexOf(messages.decision.defaultMessage) >= 0,
      );
    decisionButton.simulate('click');
    expect(editorView.state.doc).toEqualDocument(
      doc(
        decisionList({ localId: 'local-highlight' })(
          decisionItem({ localId: 'local-highlight' })('text'),
        ),
      ),
    );
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.decision.button',
    );
    toolbarOption.unmount();
    uuid.setStatic(false);
  });

  it('should track table creation event when table menu is clicked option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        tableSupported={true}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );
    toolbarOption.find('button').simulate('click');
    const tableButton = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('Table') >= 0);
    tableButton.simulate('click');
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.table.button',
    );
    toolbarOption.unmount();
  });

  it('should trigger insertMacroFromMacroBrowser when "[...] View More" option is clicked', () => {
    const { editorView } = editor(doc(p('text')));
    const insertMacroFromMacroBrowser = jest.fn();
    const macroProvider = {} as any;

    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        macroProvider={macroProvider}
        onInsertMacroFromMacroBrowser={() => insertMacroFromMacroBrowser}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );

    toolbarOption.find('button').simulate('click');
    const button = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('View more') > -1);
    button.simulate('click');
    expect(insertMacroFromMacroBrowser).toHaveBeenCalledTimes(1);
    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.macro.button',
    );
    toolbarOption.unmount();
  });

  it('should track placeholder insert event when "Add Placeholder Text" option is clicked', () => {
    const { editorView } = editor(doc(p('text')));

    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        placeholderTextEnabled={true}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );

    toolbarOption.find('button').simulate('click');
    const button = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('Placeholder Text') > -1);
    button.simulate('click');

    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.placeholder.button',
    );
    toolbarOption.unmount();
  });

  it('should track layout section insert event when "Insert columns" option is clicked', () => {
    const { editorView } = editor(doc(p('text')));

    const toolbarOption = mountWithIntlContext(
      <ToolbarInsertBlock
        layoutSectionEnabled={true}
        editorView={editorView}
        buttons={0}
        isReducedSpacing={false}
      />,
    );

    toolbarOption.find('button').simulate('click');
    const button = toolbarOption
      .find(Item)
      .filterWhere(n => n.text().indexOf('Columns') > -1);
    button.simulate('click');

    expect(trackEvent).toHaveBeenCalledWith(
      'atlassian.editor.format.layout.button',
    );
    toolbarOption.unmount();
  });

  describe('Options in insert toolbar', () => {
    it('should have table option if tableSupported is true', () => {
      const { editorView } = editor(doc(p('text')));
      const toolbarOption = mountWithIntlContext(
        <ToolbarInsertBlock
          tableSupported={true}
          editorView={editorView}
          buttons={0}
          isReducedSpacing={false}
        />,
      );
      toolbarOption.find('button').simulate('click');
      expect(
        toolbarOption
          .find('Item')
          .filterWhere(n => n.html().indexOf('Insert table') > -1).length > 0,
      ).toEqual(true);
    });

    it('should have 3 child elements if availableWrapperBlockTypes is defined', () => {
      const { editorView, pluginState: pluginStateBlockType } = editor(
        doc(p('text')),
      );
      const toolbarOption = mountWithIntlContext(
        <ToolbarInsertBlock
          availableWrapperBlockTypes={
            pluginStateBlockType.availableWrapperBlockTypes
          }
          editorView={editorView}
          buttons={0}
          isReducedSpacing={false}
        />,
      );
      const items = toolbarOption.find(DropdownMenu).prop('items');
      expect((items[0] as any).items.length).toEqual(3);
      toolbarOption.unmount();
    });

    it('should add custom items passed to the plus menu', () => {
      const { editorView } = editor(doc(p('text')));

      editorActions.appendText = jest.fn();

      const customItems = [
        {
          content: 'Custom A',
          value: { name: 'custom-a' },
          tooltipDescription: 'Custom item a',
          tooltipPosition: 'right',
          onClick: editorActions => {
            editorActions.appendText('adding custom-a');
          },
        },
        {
          content: 'Custom B',
          value: { name: 'custom-b' },
          tooltipDescription: 'Custom item b',
          tooltipPosition: 'right',
          onClick: editorActions => {
            editorActions.appendText('adding custom-b');
          },
        },
      ];

      const plusMenu = mountWithIntlContext(
        <ToolbarInsertBlock
          editorView={editorView}
          editorActions={editorActions}
          buttons={0}
          isReducedSpacing={false}
          insertMenuItems={customItems}
        />,
      );

      const items = plusMenu.find(DropdownMenu).prop('items');
      expect((items[0] as any).items.length).toEqual(2);

      const onItemActivated = plusMenu
        .find(DropdownMenu)
        .prop('onItemActivated');

      if (onItemActivated) {
        onItemActivated.call(
          {
            props: {
              editorActions: editorActions,
              insertMenuItems: customItems,
            },
          },
          { item: customItems[0] },
        );
      }

      expect(editorActions.appendText).toHaveBeenCalledWith('adding custom-a');
      plusMenu.unmount();
    });
  });
});
