import { name } from '../../../package.json';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  p,
  randomId,
  createEditor,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';

import {
  MediaPluginState,
  stateKey,
  DefaultMediaStateManager,
} from '../../../src/plugins/media/pm-plugins/main';
import { insertFileFromDataUrl } from '../../../src/utils/action';
import mediaPlugin from '../../../src/plugins/media';
import pickerFacadeLoader from '../../../src/plugins/media/picker-facade-loader';

const stateManager = new DefaultMediaStateManager();
const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    stateManager,
  });
const mediaProvider = getFreshMediaProvider();
const providerFactory = new ProviderFactory();
providerFactory.setProvider('mediaProvider', mediaProvider);

const editor = (doc: any, uploadErrorHandler?: () => void) =>
  createEditor<MediaPluginState>({
    doc,
    editorPlugins: [mediaPlugin()],
    pluginKey: stateKey,
    providerFactory,
  });

const waitForPluginStateChange = async (pluginState: MediaPluginState) =>
  new Promise(resolve => pluginState.subscribe(resolve));

describe(name, () => {
  describe('Utils -> Action', () => {
    describe('#insertFileFromDataUrl', () => {
      it('should invoke binary picker when calling insertFileFromDataUrl', async () => {
        const { pluginState, editorView } = editor(doc(p('{<>}')));
        const collectionFromProvider = sinon
          .stub(pluginState, 'collectionFromProvider' as any)
          .returns(testCollectionName);

        await pickerFacadeLoader();
        const provider = await mediaProvider;
        await provider.uploadContext;
        await waitForPluginStateChange(pluginState);

        pluginState.binaryPicker!.upload = sinon.spy();

        insertFileFromDataUrl(
          editorView.state,
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          'test.gif',
        );

        sinon.assert.calledOnce(pluginState.binaryPicker!.upload as any);
        expect((pluginState.binaryPicker!.upload as any).calledOnce).to.equal(
          true,
        );
        collectionFromProvider.restore();
        pluginState.destroy();
        editorView.destroy();
      });
    });
  });
});
