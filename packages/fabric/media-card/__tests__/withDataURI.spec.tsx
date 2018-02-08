jest.mock('../src/utils/getElementDimension');
jest.mock('../src/utils/isRetina');

import * as React from 'react';
import { shallow } from 'enzyme';
import { DataUriService } from '@atlaskit/media-core';
import {
  withDataURI,
  WithDataURIProps,
  WithDataURIState,
} from '../src/root/withDataURI';
import { getElementDimension } from '../src/utils/getElementDimension';
import { isRetina } from '../src/utils/isRetina';

const DemoComponent = () => null; // tslint:disable-line:variable-name
const DemoComponentWithDataURI = withDataURI(DemoComponent); // tslint:disable-line:variable-name

const createDataURIService = (imageDataUriDataUri = 'data:jpg') => ({
  fetchImageDataUri: jest.fn(() => Promise.resolve(imageDataUriDataUri)),
  fetchOriginalDataUri: jest.fn(),
});

async function waitForImageToLoad(dataURIService: DataUriService) {
  await dataURIService.fetchImageDataUri(
    { type: 'file', details: {} },
    { width: 0, height: 0 },
  );
}

describe('WithDataURI', () => {
  const metadata = {
    mimeType: 'image/gif',
    name: 'foobar.gif',
  };

  it('should update dataURI when dataURIService changes', async () => {
    const dataURIService1 = createDataURIService('abc');
    const element = shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI
        metadata={metadata}
        dataURIService={dataURIService1}
      />,
    );

    // wait for the image to load
    await waitForImageToLoad(dataURIService1);
    element.update();
    expect(element.prop('dataURI')).toEqual('abc');

    // update the service
    const dataURIService2 = createDataURIService('def');
    element.setProps({ dataURIService: dataURIService2 });

    // wait for the image to load
    await waitForImageToLoad(dataURIService2);
    element.update();
    expect(element.prop('dataURI')).toEqual('def');
  });

  it('should not update dataURI when an unused prop changes to a value', async () => {
    const dataURIService = createDataURIService();
    const element = shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI
        metadata={metadata}
        dataURIService={dataURIService}
      />,
    );

    // wait for the image to load
    await waitForImageToLoad(dataURIService);
    element.update();
    expect(element.prop('dataURI')).toEqual('data:jpg');

    // update the prop
    element.setProps({ foo: 'bar' });

    // wait for the image to load
    await waitForImageToLoad(dataURIService);
    element.update();
    expect(element.prop('dataURI')).toEqual('data:jpg');
  });

  it('should clear the dataURI when the metadata changes to undefined', async () => {
    const dataURIService = createDataURIService();
    const element = shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI
        metadata={metadata}
        dataURIService={dataURIService}
      />,
    );

    // wait for the image to load
    await waitForImageToLoad(dataURIService);
    element.update();
    expect(element.prop('dataURI')).toEqual('data:jpg');

    // update the metadata
    element.setProps({ metadata: undefined });

    // wait for the image to load
    await waitForImageToLoad(dataURIService);
    element.update();
    expect(element.prop('dataURI')).toBeUndefined();
  });

  it('should clear the dataURI when the metadata changes to a link', async () => {
    const dataURIService = createDataURIService();
    const element = shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI
        metadata={metadata}
        dataURIService={dataURIService}
      />,
    );

    // wait for the image to load
    await waitForImageToLoad(dataURIService);
    element.update();
    expect(element.prop('dataURI')).toEqual('data:jpg');

    // update the metadata
    element.setProps({
      metadata: {
        type: 'link',
        url: 'https://example.com',
        title: 'Example link',
      },
    });

    // wait for the image to load
    await waitForImageToLoad(dataURIService);
    element.update();
    expect(element.prop('dataURI')).toBeUndefined();
  });

  it('should call fetchImageDataUri with allowAnimated false when appearance=small', async () => {
    const dataURIService = createDataURIService();
    shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI
        appearance="small"
        metadata={metadata}
        dataURIService={dataURIService}
      />,
    );

    expect(dataURIService.fetchImageDataUri).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        allowAnimated: false,
      }),
    );
  });

  it('should call fetchImageDataUri with allowAnimated true when appearance!=small', async () => {
    const dataURIService = createDataURIService();
    shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI
        appearance="horizontal"
        metadata={metadata}
        dataURIService={dataURIService}
      />,
    );

    expect(dataURIService.fetchImageDataUri).toBeCalledWith(
      expect.anything(),
      expect.objectContaining({
        allowAnimated: true,
      }),
    );
  });

  describe('should call fetchImageDataUri with dimensions', () => {
    const percentageDimensions = {
      width: '50%',
      height: '50%',
    };
    const invalidDimensions = {
      width: 'hi',
      height: /a/,
    };
    const dimensions = {
      width: 50,
      height: 100,
    };
    const pixelDimensions = {
      width: '300px',
      height: '200px',
    };
    let dataURIService;

    beforeEach(() => {
      dataURIService = createDataURIService();
      (getElementDimension as jest.Mock<void>).mockImplementation(
        (_, dimension) => {
          if (dimension === 'width') {
            return 500;
          } else if (dimension === 'height') {
            return 200;
          }
        },
      );
      (isRetina as jest.Mock<void>).mockReturnValue(true);
    });

    it('should call fetchImageDataUri with dimentions in px when percentages passed', () => {
      shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          metadata={metadata}
          dataURIService={dataURIService}
          dimensions={percentageDimensions}
        />,
      );

      expect(dataURIService.fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 500 * 2,
          height: 200 * 2,
        }),
      );
    });

    it('should call fetchImageDataUri with given dimensions, even if they use pixels', () => {
      shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          metadata={metadata}
          dataURIService={dataURIService}
          dimensions={pixelDimensions}
        />,
      );

      expect(dataURIService.fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 300 * 2,
          height: 200 * 2,
        }),
      );
    });

    it('should return default dimensions when small appeareance is passed', () => {
      shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          metadata={metadata}
          dataURIService={dataURIService}
          dimensions={percentageDimensions}
          appearance="small"
        />,
      );

      expect(dataURIService.fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 32 * 2,
          height: 32 * 2,
        }),
      );
    });

    it('should return default dimensions when invalid dimension value is passed', () => {
      shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          metadata={metadata}
          dataURIService={dataURIService}
          dimensions={invalidDimensions}
        />,
      );

      expect(dataURIService.fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 156 * 2,
          height: 125 * 2,
        }),
      );
    });

    it('should return passed dimension when dimension are valid', () => {
      shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          metadata={metadata}
          dataURIService={dataURIService}
          dimensions={dimensions}
        />,
      );

      expect(dataURIService.fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 50 * 2,
          height: 100 * 2,
        }),
      );
    });

    it('should fetch dimensions with original size for non retina displays', () => {
      (isRetina as jest.Mock<void>).mockReturnValue(false);
      shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          metadata={metadata}
          dataURIService={dataURIService}
          dimensions={dimensions}
        />,
      );

      expect(dataURIService.fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 50,
          height: 100,
        }),
      );
    });

    it('should call fetchImageDataUri when the mimeType indicates the item is a GIF', () => {
      const dataURIService = createDataURIService();
      shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          metadata={metadata}
          dataURIService={dataURIService}
        />,
      );

      expect(dataURIService.fetchImageDataUri).toHaveBeenCalled();
      expect(dataURIService.fetchOriginalDataUri).not.toHaveBeenCalled();
    });
  });

  it('should pass down dataURI when I have one', async () => {
    const dataURIService = createDataURIService();
    const element = shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI
        metadata={metadata}
        dataURIService={dataURIService}
      />,
    );

    // wait for the image to load
    await waitForImageToLoad(dataURIService);
    element.update();

    expect(element.find(DemoComponent).props().dataURI).toBe('data:jpg');
  });

  it('should pass down other props when I am passed them', () => {
    const element = shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI data-test="foobar" />,
    );

    expect(element.find(DemoComponent).prop('data-test')).toBe('foobar');
  });

  it('should not pass down dataURIService when I have one', () => {
    const dataURIService = createDataURIService();

    const element = shallow<WithDataURIProps, WithDataURIState>(
      <DemoComponentWithDataURI dataURIService={dataURIService} />,
    );

    expect(element.find(DemoComponent).prop('dataURIService')).toBe(undefined);
  });
});
