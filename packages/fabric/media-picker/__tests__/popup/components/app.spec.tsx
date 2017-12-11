import * as React from 'react';
import { shallow } from 'enzyme';

import ConnectedApp, { App } from '../../../src/popup/components/app';
import UploadView from '../../../src/popup/components/views/upload/upload';
import Browser from '../../../src/popup/components/views/browser/browser';
import { getComponentClassWithStore, mockStore } from '../mocks';
import { fileUploadsStart } from '../../../src/popup/actions/fileUploadsStart';

describe('App', () => {
  const apiUrl = 'some-api-url';
  const clientId = 'some-client-id';
  const token = 'some-token';
  const userAuthProvider = () => Promise.resolve({ clientId, token });

  const setup = () => ({
    handlers: {
      onStartApp: jest.fn(),
      onClose: jest.fn(),
      onUploadsStart: jest.fn(),
      onUploadPreviewUpdate: jest.fn(),
      onUploadStatusUpdate: jest.fn(),
      onUploadProcessing: jest.fn(),
      onUploadEnd: jest.fn(),
      onUploadError: jest.fn(),
    },
    store: mockStore(),
  });

  it('should render UploadView given selectedServiceName is "upload"', () => {
    const { handlers, store } = setup();
    const app = shallow(
      <App
        store={store}
        apiUrl={apiUrl}
        selectedServiceName="upload"
        userAuthProvider={userAuthProvider}
        isVisible={true}
        {...handlers}
      />,
    );

    expect(app.find(UploadView).length).toEqual(1);
  });

  it('should render Browser given selectedServiceName is "google"', () => {
    const { handlers, store } = setup();
    const app = shallow(
      <App
        store={store}
        apiUrl={apiUrl}
        selectedServiceName="google"
        userAuthProvider={userAuthProvider}
        isVisible={true}
        {...handlers}
      />,
    );

    expect(app.find(Browser).length).toEqual(1);
  });

  it('should call onStartApp', () => {
    const { handlers, store } = setup();
    shallow(
      <App
        store={store}
        apiUrl={apiUrl}
        selectedServiceName="upload"
        userAuthProvider={userAuthProvider}
        isVisible={true}
        {...handlers}
      />,
    );

    expect(handlers.onStartApp).toHaveBeenCalledTimes(1);
  });
});

describe('Connected App', () => {
  const setup = () => {
    const store = mockStore();
    const dispatch = store.dispatch;
    const ConnectedAppWithStore = getComponentClassWithStore(ConnectedApp);
    const component = shallow(<ConnectedAppWithStore store={store} />).find(
      App,
    );
    return { dispatch, component };
  };

  it('should dispatch FILE_UPLOADS_START when onUploadsStart is called', () => {
    const { component, dispatch } = setup();

    const nowDate = Date.now();
    const payload = {
      files: [
        {
          id: 'some-id',
          name: 'some-name',
          size: 42,
          creationDate: nowDate,
          type: 'image/jpg',
          publicId: 'some-public-id',
        },
      ],
    };
    component.props().onUploadsStart(payload);

    expect(dispatch).toHaveBeenCalledWith(
      fileUploadsStart({
        files: [
          {
            id: 'some-id',
            name: 'some-name',
            size: 42,
            creationDate: nowDate,
            type: 'image/jpg',
            publicId: 'some-public-id',
          },
        ],
      }),
    );
  });
});
