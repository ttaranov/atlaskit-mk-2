import { name } from '../../../../package.json';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { DefaultMediaStateManager } from '@atlaskit/media-core';
import { mediaPluginFactory, MediaPluginState, ProviderFactory } from '../../../../src';
import { doc, p, randomId, makeEditor, storyMediaProviderFactory } from '../../../../src/test-helper';
import defaultSchema from '../../../../src/test-helper/schema';
import { insertFileFromDataUrl } from '../../../../src/editor/utils/action';

const stateManager = new DefaultMediaStateManager();
const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
const getFreshMediaProvider = () => storyMediaProviderFactory({ collectionName: testCollectionName, stateManager });
const mediaProvider = getFreshMediaProvider();
const providerFactory = new ProviderFactory();
providerFactory.setProvider('mediaProvider', mediaProvider);

const editor = (doc: any, uploadErrorHandler?: () => void) => makeEditor<MediaPluginState>({
  doc,
  plugins: [...mediaPluginFactory(defaultSchema, { providerFactory, uploadErrorHandler })],
  schema: defaultSchema
});

describe(name, () => {
  describe('Utils -> Action', () => {
    describe('#insertFileFromDataUrl', () => {
      it('should invoke binary picker when calling insertFileFromDataUrl', async () => {
        const { pluginState, editorView } = editor(doc(p('{<>}')));
        const collectionFromProvider = sinon.stub(pluginState, 'collectionFromProvider').returns(testCollectionName);
        const provider = await mediaProvider;
        await provider.uploadContext;

        pluginState.binaryPicker!.upload = sinon.spy();

        insertFileFromDataUrl(
          editorView.state,
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
          'test.gif'
        );

        sinon.assert.calledOnce(pluginState.binaryPicker!.upload as any);
        expect((pluginState.binaryPicker!.upload as any).calledOnce).to.equal(true);
        collectionFromProvider.restore(); pluginState.destroy(); editorView.destroy();
      });
    });
  });
});
