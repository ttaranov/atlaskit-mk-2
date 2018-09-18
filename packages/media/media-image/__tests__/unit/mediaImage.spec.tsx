import * as React from 'react';
import { shallow } from 'enzyme';
import MediaImage, { MediaImageProps } from '../../src';
import { Context } from '@atlaskit/media-core';
import { Observable } from 'rxjs';

describe('<MediaImage />', () => {
  const setup = (props?: Partial<MediaImageProps>) => {
    const getFile = jest.fn().mockReturnValue(
      Observable.of({
        status: 'processed',
        mediaType: 'image',
      }),
    );
    const getImage = jest.fn().mockReturnValue({});
    const context: any = {
      getFile,
      getImage,
    };
    const id = '1';
    const loadingPlaceholder = <div>loading</div>;
    const errorPlaceholder = <div>error</div>;
    const mediaImage = shallow(
      <MediaImage
        id={id}
        loadingPlaceholder={loadingPlaceholder}
        errorPlaceholder={errorPlaceholder}
        context={context}
        {...props}
      />,
    );

    return {
      mediaImage,
      getFile,
      getImage,
    };
  };

  it('should render a placeholder while the src is loading', () => {
    const { mediaImage } = setup();

    expect(mediaImage.find('div')).toHaveLength(1);
    expect(mediaImage.find('div').text()).toEqual('loading');
  });

  it('should get image preview with given options', async () => {
    const { getFile, getImage } = setup({
      width: 100,
      height: 100,
      upscale: true,
      mode: 'full-fit',
    });

    expect(getFile).toHaveBeenCalledTimes(1);
    expect(getFile).lastCalledWith('1', { collectionName: undefined });
    expect(getImage).toHaveBeenCalledTimes(1);
    expect(getImage).toBeCalledWith('1', {
      collection: undefined,
      width: 100,
      height: 100,
      upscale: true,
      mode: 'full-fit',
    });
  });

  it('should use collection name', () => {
    const { getFile, getImage } = setup({ collectionName: 'test' });

    expect(getFile).lastCalledWith('1', { collectionName: 'test' });
    expect(getImage).toBeCalledWith('1', {
      collection: 'test',
    });
  });

  it('should render an img tag with the right src', async () => {
    const { mediaImage, getImage } = setup();

    await getImage;
    mediaImage.update();

    expect(mediaImage.find('img').prop('src')).toEqual(
      'mock result of URL.createObjectURL()',
    );
  });

  it('should render error placeholder if request fails', () => {
    const getFile = jest.fn().mockReturnValue(
      Observable.create(observer => {
        observer.error('');
      }),
    );
    const getImage = jest.fn().mockReturnValue({});
    const context: any = {
      getFile,
      getImage,
    };
    const { mediaImage } = setup({ context });

    mediaImage.update();

    expect(mediaImage.find('div').text()).toEqual('error');
  });

  it('should render error placeholder for non image files', () => {
    const getFile = jest.fn().mockReturnValue(
      Observable.of({
        status: 'processed',
        mediaType: 'doc',
      }),
    );
    const getImage = jest.fn().mockReturnValue({});
    const context: any = {
      getFile,
      getImage,
    };
    const { mediaImage } = setup({ context });

    mediaImage.update();

    expect(mediaImage.find('div').text()).toEqual('error');
  });
});
