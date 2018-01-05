import { mount } from 'enzyme';
import * as React from 'react';
import mediaPlugins, {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../../src/plugins/media';
import ToolbarButton from '../../src/ui/ToolbarButton';
import ToolbarMedia from '../../src/ui/ToolbarMedia';
import { MediaProvider } from '@atlaskit/media-core';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  makeEditor,
  defaultSchema,
} from '@atlaskit/editor-test-helpers';
import EditorWidth from '../../src/utils/editor-width';

const mediaProvider: Promise<MediaProvider> = Promise.resolve({
  viewContext: Promise.resolve({} as any),
  uploadContext: Promise.resolve({} as any),
});

const providerFactory = ProviderFactory.create({ mediaProvider });

describe('ToolbarMedia', () => {
  const editor = (doc: any) =>
    makeEditor<MediaPluginState>({
      doc,
      plugins: mediaPlugins(defaultSchema, { providerFactory }),
    });

  it('should have spacing of toolbar button set to default if EditorWidth is provided', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarMedia
        pluginKey={mediaStateKey}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint5 + 1}
      />,
    );
    toolbarOption.setState({ disabled: false });
    expect(toolbarOption.find(ToolbarButton).prop('spacing')).toEqual(
      'default',
    );
    toolbarOption.unmount();
  });

  it('should return null if EditorWidth is less then BreakPoint6', () => {
    const { editorView } = editor(doc(p('text')));
    const toolbarOption = mount(
      <ToolbarMedia
        pluginKey={mediaStateKey}
        editorView={editorView}
        editorWidth={EditorWidth.BreakPoint6 - 1}
      />,
    );
    toolbarOption.setState({ disabled: false });
    expect(toolbarOption.html()).toEqual(null);
    toolbarOption.unmount();
  });
});
