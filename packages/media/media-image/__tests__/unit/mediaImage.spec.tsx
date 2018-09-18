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
      }),
    );
    const getImage = jest.fn().mockReturnValue({});
    const context: any = {
      getFile,
      getImage,
    };
    const id = '1';
    const loadingPlaceholder = <div>loading</div>;
    const mediaImage = shallow(
      <MediaImage
        id={id}
        loadingPlaceholder={loadingPlaceholder}
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

  it('should use given dimensions', async () => {
    const { mediaImage, getFile, getImage } = setup({
      width: 100,
      height: 100,
    });

    expect(getFile).toHaveBeenCalledTimes(1);
    expect(getFile).lastCalledWith('1', { collectionName: undefined });
    expect(getImage).toHaveBeenCalledTimes(1);
    expect(getImage).toBeCalledWith('1', {
      collection: undefined,
      width: 100,
      height: 100,
    });

    await getImage;
    mediaImage.update();

    expect(mediaImage.find('img').prop('style')).toEqual({
      width: '100px',
      height: '100px',
    });
  });

  it('should use collection name', () => {});

  it('should wait until the file has been processed', () => {});

  it('should render an img tag with the right src', () => {});

  it('should render error placeholder if request fails', () => {});

  it('should render error placeholder for non image files', () => {});
});
