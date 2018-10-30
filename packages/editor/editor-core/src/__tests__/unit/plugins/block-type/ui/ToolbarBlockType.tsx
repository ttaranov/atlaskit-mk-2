import * as React from 'react';
import Item from '@atlaskit/item';
import AkButton from '@atlaskit/button';
import {
  doc,
  p,
  createEditor,
  code_block,
  blockquote,
  panel,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import TextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';

import { pluginKey } from '../../../../../plugins/block-type/pm-plugins/main';
import ToolbarBlockType from '../../../../../plugins/block-type/ui/ToolbarBlockType';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import {
  NORMAL_TEXT,
  HEADING_1,
  HEADING_2,
  HEADING_3,
  HEADING_4,
  HEADING_5,
  HEADING_6,
  messages,
} from '../../../../../plugins/block-type/types';
import { analyticsService } from '../../../../../analytics';
import panelPlugin from '../../../../../plugins/panel';
import listPlugin from '../../../../../plugins/lists';
import codeBlockPlugin from '../../../../../plugins/code-block';
import { setBlockType } from '../../../../../plugins/block-type/commands';

describe('@atlaskit/editor-core/ui/ToolbarBlockType', () => {
  const editor = (doc: any) =>
    createEditor({
      doc,
      pluginKey,
      editorPlugins: [panelPlugin, listPlugin, codeBlockPlugin()],
    });

  it('should render disabled ToolbarButton if isDisabled property is true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={name => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if current selection is blockquote', () => {
    const { editorView, pluginState } = editor(doc(blockquote(p('te{<>}xt'))));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={name => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should not render disabled ToolbarButton if current selection is panel', () => {
    const { editorView, pluginState } = editor(doc(panel()(p('te{<>}xt'))));
    const { state, dispatch } = editorView;

    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={name => setBlockType(name)(state, dispatch)}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(false);
    toolbarOption.unmount();
  });

  it('should render disabled ToolbarButton if code-block is selected', () => {
    const { editorView, pluginState } = editor(
      doc(code_block({ language: 'js' })('te{<>}xt')),
    );
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={name => setBlockType(name)(state, dispatch)}
        isDisabled={true}
      />,
    );
    expect(toolbarOption.find(AkButton).prop('isDisabled')).toBe(true);
    toolbarOption.unmount();
  });

  it('should have spacing of toolbar button set to none if property isReducedSpacing=true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={name => setBlockType(name)(state, dispatch)}
        isReducedSpacing={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toBe('none');
    toolbarOption.unmount();
  });

  it('should render icon in dropdown-menu if property isSmall=true', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={name => setBlockType(name)(state, dispatch)}
        isSmall={true}
      />,
    );
    expect(toolbarOption.find(ToolbarButton).find(TextStyleIcon).length).toBe(
      1,
    );
    toolbarOption.unmount();
  });

  it('should render current block type in dropdown-menu if property isSmall=false', () => {
    const { editorView, pluginState } = editor(doc(p('text')));
    const { state, dispatch } = editorView;
    const toolbarOption = mountWithIntl(
      <ToolbarBlockType
        pluginState={pluginState}
        setBlockType={name => setBlockType(name)(state, dispatch)}
      />,
    );
    expect(
      toolbarOption
        .find(ToolbarButton)
        .first()
        .text(),
    ).toContain(messages.normal.defaultMessage);
    toolbarOption.unmount();
  });

  describe('blockType dropdown items', () => {
    let toolbarOption;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text')));
      const { state, dispatch } = editorView;
      toolbarOption = mountWithIntl(
        <ToolbarBlockType
          pluginState={pluginState}
          setBlockType={name => setBlockType(name)(state, dispatch)}
        />,
      );
      toolbarOption.find('button').simulate('click');
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    [
      NORMAL_TEXT,
      HEADING_1,
      HEADING_2,
      HEADING_3,
      HEADING_4,
      HEADING_5,
      HEADING_6,
    ].forEach(blockType => {
      it(`should have tagName ${blockType.tagName} present`, () => {
        expect(
          toolbarOption
            .find(Item)
            .findWhere(
              n =>
                n.type() === blockType.tagName &&
                n.text() === blockType.title.defaultMessage,
            ).length,
        ).toEqual(1);
      });
    });
  });

  describe('analytics', () => {
    let trackEvent;
    let toolbarOption;
    beforeEach(() => {
      const { editorView, pluginState } = editor(doc(p('text')));
      const { state, dispatch } = editorView;
      toolbarOption = mountWithIntl(
        <ToolbarBlockType
          pluginState={pluginState}
          setBlockType={name => setBlockType(name)(state, dispatch)}
        />,
      );
      toolbarOption.find('button').simulate('click');
      trackEvent = jest.fn();
      analyticsService.trackEvent = trackEvent;
    });

    afterEach(() => {
      toolbarOption.unmount();
    });

    [
      NORMAL_TEXT,
      HEADING_1,
      HEADING_2,
      HEADING_3,
      HEADING_4,
      HEADING_5,
      HEADING_6,
    ].forEach(blockType => {
      it(`should trigger analyticsService.trackEvent when ${
        blockType.title.defaultMessage
      } is clicked`, () => {
        toolbarOption
          .find(Item)
          .filterWhere(n => n.text() === blockType.title.defaultMessage)
          .simulate('click');
        expect(trackEvent).toHaveBeenCalledWith(
          `atlassian.editor.format.${blockType.name}.button`,
        );
      });
    });
  });
});
