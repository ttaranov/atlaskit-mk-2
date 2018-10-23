jest.mock('../../../../plugins/media/picker-facade');

import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  randomId,
  createEditor,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';

import {
  stateKey as mediaPluginKey,
  MediaPluginState,
  DefaultMediaStateManager,
} from '../../../../plugins/media/pm-plugins/main';
import mediaPlugin from '../../../../plugins/media';
import PickerFacade from '../../../../plugins/media/picker-facade';

const stateManager = new DefaultMediaStateManager();
const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    stateManager,
    includeUserAuthProvider: true,
  });

const waitForPluginStateChange = async (pluginState: MediaPluginState) =>
  new Promise(resolve => pluginState.subscribe(resolve));

describe('Media with mock facade', () => {
  const mediaProvider = getFreshMediaProvider();
  const providerFactory = ProviderFactory.create({ mediaProvider });

  const editor = (
    doc: any,
    editorProps = {},
    dropzoneContainer: HTMLElement = document.body,
  ) =>
    createEditor<MediaPluginState>({
      doc,
      editorPlugins: [
        mediaPlugin({
          provider: mediaProvider,
          allowMediaSingle: true,
          customDropzoneContainer: dropzoneContainer,
        }),
      ],
      editorProps: editorProps,
      providerFactory,
      pluginKey: mediaPluginKey,
    });

  const spies = {} as any;
  const removeOnCloseListener = jest.fn();
  beforeAll(() => {
    (PickerFacade as any).mockImplementation(pickerType => {
      const picker = {
        on: jest.fn(),
        onClose: jest.fn().mockReturnValue(removeOnCloseListener),
        onNewMedia: jest.fn(),
        onDrag: jest.fn(),
        hide: jest.fn(),
        setUploadParams: jest.fn(),
        show: jest.fn(),
        deactivate: jest.fn(),
        activate: jest.fn(),
        destroy: jest.fn(),
        type: 'popup',
      };
      spies[pickerType] = picker;
      return picker;
    });
  });

  it('should add an onClose event listener in popupPicker', async () => {
    const { pluginState } = editor(doc(p('{<>}')));

    await waitForPluginStateChange(pluginState);

    const provider = await mediaProvider;
    await provider.uploadContext;
    await provider.viewContext;

    expect(spies.popup.onClose).toHaveBeenCalledTimes(1);
    expect(spies.popup.onClose).toHaveBeenCalledWith(
      pluginState.onPopupPickerClose,
    );
    pluginState.destroy();
  });

  it('should cleanup properly on destroy', async () => {
    removeOnCloseListener.mockClear();
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForPluginStateChange(pluginState);

    const provider = await mediaProvider;
    await provider.uploadContext;
    await provider.viewContext;

    pluginState.destroy();
    expect(removeOnCloseListener).toHaveBeenCalledTimes(1);
  });

  it('should deactivate the drop-zone picker on showMediaPicker', async () => {
    spies.popup.show.mockClear();
    spies.dropzone.deactivate.mockClear();
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForPluginStateChange(pluginState);

    const provider = await mediaProvider;
    await provider.uploadContext;
    await provider.viewContext;

    pluginState.showMediaPicker();
    expect(spies.popup.show).toHaveBeenCalledTimes(1);
    expect(spies.dropzone.deactivate).toHaveBeenCalledTimes(1);
    pluginState.destroy();
  });

  it('should activate the drop-zone picker after media picker closed', async () => {
    spies.popup.show.mockClear();
    spies.dropzone.activate.mockClear();
    const { pluginState } = editor(doc(p('{<>}')));
    await waitForPluginStateChange(pluginState);

    const provider = await mediaProvider;
    await provider.uploadContext;
    await provider.viewContext;

    pluginState.showMediaPicker();
    expect(spies.dropzone.activate).toHaveBeenCalledTimes(0);
    pluginState.onPopupPickerClose();
    expect(spies.dropzone.activate).toHaveBeenCalledTimes(1);
    pluginState.destroy();
  });
});
