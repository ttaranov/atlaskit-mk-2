import * as React from 'react';
import {
  doc,
  mediaSingle,
  media,
  randomId,
  createEditor,
  bodiedExtension,
  layoutColumn,
  layoutSection,
  p,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import { stateKey as pluginKey } from '../../../../../plugins/media/pm-plugins/main';
import ToolbarButton from '../../../../../ui/ToolbarButton';
import FloatingToolbar from '../../../../../ui/FloatingToolbar';
import MediaSingleEdit from '../../../../../plugins/media/ui/MediaSingleEdit';

describe('@atlaskit/editor-core/ui/MediaSingleEdit', () => {
  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        media: {
          provider: new Promise(() => {}),
          allowMediaSingle: true,
        },
        allowExtension: true,
        allowLayouts: true,
      },
    });
  it('should have layout options if media single not inside bodied extension', () => {
    const { editorView } = editor(
      doc(
        mediaSingle({ layout: 'center' })(
          media({
            id: temporaryFileId,
            __key: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileMimeType: 'image/png',
            width: 100,
            height: 100,
          })(),
        ),
      ),
    );
    editorView.focus();
    const pluginState = pluginKey.getState(editorView.state);

    const mediaSingleEdit = mountWithIntl(
      <MediaSingleEdit
        pluginState={pluginState}
        allowBreakout={true}
        allowLayout={true}
      />,
    );
    expect(editorView.state.selection.$from.node().type.name).toEqual(
      'mediaSingle',
    );
    expect(
      mediaSingleEdit.find(FloatingToolbar).findWhere(child => {
        return child.type() === ToolbarButton && child.prop('disabled');
      }).length,
    ).toEqual(0);
    mediaSingleEdit.unmount();
  });

  it('should not have layout options if media single inside bodied extension', async () => {
    const { editorView } = editor(
      doc(
        bodiedExtension({
          extensionKey: 'extensionKey',
          extensionType: 'bodiedExtension',
        })(
          mediaSingle({ layout: 'center' })(
            media({
              id: temporaryFileId,
              __key: temporaryFileId,
              type: 'file',
              collection: testCollectionName,
              __fileMimeType: 'image/png',
              width: 100,
              height: 100,
            })(),
          ),
        ),
      ),
    );

    editorView.focus();
    const pluginState = pluginKey.getState(editorView.state);

    const mediaSingleEdit = mountWithIntl(
      <MediaSingleEdit
        pluginState={pluginState}
        target={pluginState.element}
        allowBreakout={true}
        allowLayout={false}
      />,
    );
    expect(editorView.state.selection.$from.node().type.name).toEqual(
      'mediaSingle',
    );

    expect(
      mediaSingleEdit.find(ToolbarButton).findWhere(child => {
        return child.type() === ToolbarButton && child.prop('disabled');
      }).length,
    ).toEqual(5);
    mediaSingleEdit.unmount();
  });

  it('should not have layout options if media single inside layoutSection', () => {
    const { editorView } = editor(
      doc(
        layoutSection(
          layoutColumn({ width: 50 })(p('')),
          layoutColumn({ width: 50 })(
            mediaSingle({ layout: 'center' })(
              media({
                id: temporaryFileId,
                __key: temporaryFileId,
                type: 'file',
                collection: testCollectionName,
                __fileMimeType: 'image/png',
                width: 100,
                height: 100,
              })(),
            ),
          ),
        ),
      ),
    );
    editorView.focus();
    const pluginState = pluginKey.getState(editorView.state);

    const mediaSingleEdit = mountWithIntl(
      <MediaSingleEdit
        pluginState={pluginState}
        target={pluginState.element}
        allowBreakout={true}
        allowLayout={false}
      />,
    );
    expect(editorView.state.selection.$from.node().type.name).toEqual(
      'mediaSingle',
    );
    expect(
      mediaSingleEdit.find(ToolbarButton).findWhere(child => {
        return child.type() === ToolbarButton && child.prop('disabled');
      }).length,
    ).toEqual(5);
    mediaSingleEdit.unmount();
  });
});
