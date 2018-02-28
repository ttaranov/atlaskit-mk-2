jest.mock('@atlaskit/media-store');

import * as React from 'react';
import { shallow } from 'enzyme';
import { MediaStore } from '@atlaskit/media-store';
import { MediaImage } from '../src';

describe('MediaImage', () => {
  const setup = () => {
    const id = '1234';
    const authProvider = () =>
      Promise.resolve({ clientId: 'client-id', token: 'token' });
    const config = {
      apiUrl: '',
      authProvider,
    };
    const params = {
      width: 100,
    };
    const getFileImageURL = jest
      .fn()
      .mockReturnValue(Promise.resolve('image-url'));
    const storeMock = jest.fn().mockImplementation(() => ({
      getFileImageURL,
    }));
    (MediaStore as any) = storeMock;

    return {
      id,
      config,
      storeMock,
      getFileImageURL,
      params,
    };
  };

  it('should render an image when the auth is resolved', async () => {
    const { id, config, params, getFileImageURL } = setup();
    const component = shallow(
      <MediaImage id={id} config={config} params={params} />,
    );

    await config.authProvider();
    component.update();

    expect(getFileImageURL).toHaveBeenCalledTimes(1);
    expect(getFileImageURL.mock.calls[0][0]).toEqual(id);
    expect(getFileImageURL.mock.calls[0][1]).toEqual(params);
    expect(component.find('img').prop('src')).toEqual('image-url');
  });

  it('should pass down classNames property', async () => {
    const { id, config } = setup();
    const component = shallow(
      <MediaImage id={id} config={config} className="custom-class" />,
    );

    await config.authProvider();
    component.update();

    expect(component.find('img').prop('className')).toEqual('custom-class');
  });

  it('img element should have only relevant properties', async () => {
    const { id, config, params } = setup();
    const component = shallow(
      <MediaImage id={id} config={config} params={params} />,
    );

    await config.authProvider();

    component.update();

    expect(component.find('img').props()).toEqual({
      src: 'image-url',
    });
  });

  it('should pass down extra properties', async () => {
    const { id, config, params } = setup();
    const onError = jest.fn();
    const onLoad = jest.fn();
    const component = shallow(
      <MediaImage
        id={id}
        config={config}
        params={params}
        onError={onError}
        onLoad={onLoad}
      />,
    );

    await config.authProvider();
    component.update();

    expect(component.find('img').props()).toEqual({
      src: 'image-url',
      onError,
      onLoad,
    });
  });

  it('should create a new store if token has changed', async () => {
    const { id, config, storeMock } = setup();
    const onError = jest.fn();
    const onLoad = jest.fn();
    const newAuthProvider = () =>
      Promise.resolve({ clientId: 'client-id', token: 'new-token' });
    const newConfig = {
      apiUrl: '',
      authProvider: newAuthProvider,
    };
    const component = shallow(<MediaImage id={id} config={config} />);

    await config.authProvider();
    component.setProps({ config: newConfig });
    await newConfig.authProvider();

    expect(storeMock).toHaveBeenCalledTimes(2);
    expect(storeMock.mock.calls[0][0]).toEqual(config);
    expect(storeMock.mock.calls[1][0]).toEqual(newConfig);
  });

  it('should fetch new image src if params has changed', async () => {
    const { id, config, getFileImageURL } = setup();
    const onError = jest.fn();
    const onLoad = jest.fn();
    const newAuthProvider = () =>
      Promise.resolve({ clientId: 'client-id', token: 'new-token' });
    const component = shallow(<MediaImage id={id} config={config} />);

    await config.authProvider();
    component.setProps({ id: 'new-id' });
    await config.authProvider();
    component.setProps({ params: { width: 200 } });
    await config.authProvider();

    expect(getFileImageURL).toHaveBeenCalledTimes(3);
    expect(getFileImageURL.mock.calls[0][0]).toEqual(id);
    expect(getFileImageURL.mock.calls[1][0]).toEqual('new-id');
    expect(getFileImageURL.mock.calls[2][0]).toEqual('new-id');
    expect(getFileImageURL.mock.calls[2][1]).toEqual({ width: 200 });
  });
});
