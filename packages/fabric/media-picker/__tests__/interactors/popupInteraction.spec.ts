import { PostisChannel } from 'postis';
import { InteractionLayer } from '../../src/interactors/popupInteraction';

describe('Interaction layer main', () => {
  // const popup: any = {};
  const auth = {
    clientId: 'some-client-id',
    token: 'some-client-token',
  };
  const mockChannel = () => ({
    listen: jest.fn(),
    send: jest.fn(),
    ready: jest.fn(),
    destroy: jest.fn(),
  });
  const mockInteractionLayer = (channel: PostisChannel) => {
    const interactionLayer = new InteractionLayer(channel);

    return interactionLayer;
  };

  it('sends resetView message', () => {
    const channel = mockChannel();
    const iframeClient = mockInteractionLayer(channel);

    iframeClient.resetView();
    expect(channel.send).toBeCalledWith({
      method: 'resetView',
    });
  });

  it('sends cancelUpload message', () => {
    const channel = mockChannel();
    const iframeClient = mockInteractionLayer(channel);
    const uploadId = 'uploadId';

    iframeClient.cancelUpload(uploadId);
    expect(channel.send).toBeCalledWith({
      method: 'cancelUpload',
      params: {
        uploadId,
      },
    });
  });

  it('should send setTeant message', () => {
    const uploadParams = {
      collection: 'some-collection',
      fetchMetadata: true,
      autoFinalize: true,
    };
    const channel = mockChannel();
    const iframeClient = mockInteractionLayer(channel);

    iframeClient.setTenant({
      auth,
      uploadParams,
    });
    expect(channel.send).toBeCalledWith({
      method: 'setTenant',
      params: {
        auth,
        uploadParams,
      },
    });
  });

  it('should sanitize uploadParams when sending setTenant message', () => {
    const channel = mockChannel();
    const iframeClient = mockInteractionLayer(channel);
    const uploadParams = {
      collection: 'some-collection',
    };

    iframeClient.setTenant({
      auth,
      uploadParams: {
        ...uploadParams,
        dropZone: document.createElement('div'),
      } as any,
    });
    expect(channel.send).toBeCalledWith({
      method: 'setTenant',
      params: {
        auth,
        uploadParams,
      },
    });
  });
});
