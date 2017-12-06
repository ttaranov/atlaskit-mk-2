jest.mock('../src/utils/getElementDimension');
jest.mock('../src/utils/isRetina');

import * as React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { waitUntil } from '@atlaskit/media-test-helpers';
import {
  withDataURI,
  WithDataURI,
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

const waitUntilDataURIIsTruthy = (
  card: ShallowWrapper<WithDataURIProps, WithDataURIState>,
) => {
  return waitUntil(() => Boolean(card.state().dataURI), 50);
};

describe('WithDataURI', () => {
  const metadata = {
    mimeType: 'image/gif',
    name: 'foobar.gif',
  };

  describe('.componentWillReceiveProps()', () => {
    it('should attempt to update the dataURI when the dataURIService prop changes', () => {
      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI />,
      );

      const instance = element.instance() as WithDataURI;
      const updateDataURI = jest.spyOn(instance, 'updateDataURI');

      instance.componentWillReceiveProps({
        dataURIService: createDataURIService(),
      });

      expect(updateDataURI).toHaveBeenCalledTimes(1);
    });

    it('should attempt to update the dataURI when the metadata prop changes', () => {
      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI />,
      );

      const instance = element.instance() as WithDataURI;
      const updateDataURI = jest.spyOn(instance, 'updateDataURI');

      instance.componentWillReceiveProps({ metadata: {} });

      expect(updateDataURI).toHaveBeenCalledTimes(1);
    });

    it('should not attempt to update the dataURI when another prop changes', () => {
      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI />,
      );

      const instance = element.instance() as WithDataURI;
      const updateDataURI = jest.spyOn(instance, 'updateDataURI');
      instance.componentWillReceiveProps({ foo: 'bar' });

      expect(updateDataURI).not.toHaveBeenCalled();
    });
  });

  describe('.updateDataURI()', () => {
    it('should clear the dataURI when the metadata is undefined', () => {
      const dataURIService = createDataURIService();

      const metadata = {
        name: 'foobar.gif',
      };

      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          dataURIService={dataURIService}
          metadata={metadata}
        />,
      );

      element.setState({ dataURI: 'data:png' });

      const instance = element.instance() as WithDataURI;
      instance.updateDataURI({ dataURIService, metadata: undefined });

      expect(element.state().dataURI).toBe(undefined);
    });

    it('should clear the dataURI when the metadata is a link', () => {
      const dataURIService = createDataURIService();

      const metadata = {
        url: 'https://example.com',
        title: 'Example link',
      };

      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          dataURIService={dataURIService}
          metadata={metadata}
        />,
      );

      element.setState({ dataURI: 'data:png' });
      const instance = element.instance() as WithDataURI;
      instance.updateDataURI({ dataURIService, metadata: undefined });

      expect(element.state().dataURI).toBe(undefined);
    });

    it('should set the dataURI to a GIF when the mimeType indicates the item is a GIF', () => {
      const dataURIService = createDataURIService('data:gif');

      const metadata = {
        mimeType: 'image/gif',
      };

      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          dataURIService={dataURIService}
          metadata={metadata}
        />,
      );
      const instance = element.instance() as WithDataURI;
      instance.updateDataURI({ dataURIService, metadata });

      return waitUntilDataURIIsTruthy(element).then(() =>
        expect(element.state().dataURI).toBe('data:gif'),
      );
    });

    it('should set the dataURI to a JPG when the mimeType indicates the item is not a GIF', () => {
      const dataURIService = createDataURIService();

      const metadata = {
        mimeType: 'image/jpeg',
      };

      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          dataURIService={dataURIService}
          metadata={metadata}
        />,
      );

      const instance = element.instance() as WithDataURI;
      instance.updateDataURI({ dataURIService, metadata });

      return waitUntilDataURIIsTruthy(element).then(() =>
        expect(element.state().dataURI).toBe('data:jpg'),
      );
    });

    it('should call fetchImageDataUri with allowAnimated false', () => {
      const dataURIService = createDataURIService();
      const metadata = {
        name: 'foobar.png',
      };

      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          dataURIService={dataURIService}
          metadata={metadata}
        />,
      );

      const instance = element.instance() as WithDataURI;
      instance.updateDataURI({ dataURIService, metadata, appearance: 'small' });

      expect(
        dataURIService.fetchImageDataUri.mock.calls[0][1].allowAnimated,
      ).toEqual(false);
    });

    it('should call fetchImageDataUri with allowAnimated true', () => {
      const dataURIService = createDataURIService();
      const metadata = {
        name: 'foobar.png',
      };

      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          dataURIService={dataURIService}
          metadata={metadata}
        />,
      );

      const instance = element.instance() as WithDataURI;
      instance.updateDataURI({ dataURIService, metadata, appearance: 'auto' });

      expect(
        dataURIService.fetchImageDataUri.mock.calls[0][1].allowAnimated,
      ).toEqual(true);
    });

    describe('with dimensions', () => {
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
        const element = shallow<WithDataURIProps, WithDataURIState>(
          <DemoComponentWithDataURI
            dataURIService={dataURIService}
            metadata={metadata}
            dimensions={percentageDimensions}
          />,
        );

        const instance = element.instance() as WithDataURI;
        instance.updateDataURI({ dataURIService, metadata });

        expect(dataURIService.fetchImageDataUri).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            width: 500,
            height: 200,
          }),
        );
      });

      it('should return default dimensions when small appeareance is passed', () => {
        const element = shallow<WithDataURIProps, WithDataURIState>(
          <DemoComponentWithDataURI
            dataURIService={dataURIService}
            metadata={metadata}
            dimensions={percentageDimensions}
            appearance="small"
          />,
        );

        const instance = element.instance() as WithDataURI;
        instance.updateDataURI({ dataURIService, metadata });

        expect(dataURIService.fetchImageDataUri).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            width: 144 * 2,
            height: 96 * 2,
          }),
        );
      });

      it('should return default dimensions when invalid dimension value is passed', () => {
        const element = shallow<WithDataURIProps, WithDataURIState>(
          <DemoComponentWithDataURI
            dataURIService={dataURIService}
            metadata={metadata}
            dimensions={invalidDimensions}
          />,
        );

        const instance = element.instance() as WithDataURI;
        instance.updateDataURI({ dataURIService, metadata });

        expect(dataURIService.fetchImageDataUri).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            width: 156 * 2,
            height: 125 * 2,
          }),
        );
      });

      it('should return passed dimension when dimension are valid', () => {
        const element = shallow<WithDataURIProps, WithDataURIState>(
          <DemoComponentWithDataURI
            dataURIService={dataURIService}
            metadata={metadata}
            dimensions={dimensions}
          />,
        );

        const instance = element.instance() as WithDataURI;
        instance.updateDataURI({ dataURIService, metadata });

        expect(dataURIService.fetchImageDataUri).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({
            width: 100,
            height: 200,
          }),
        );
      });
    });

    it('should call fetchImageDataUri when the mimeType indicates the item is a GIF', () => {
      const dataURIService = createDataURIService();
      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI
          dataURIService={dataURIService}
          metadata={metadata}
        />,
      );

      const instance = element.instance() as WithDataURI;
      instance.updateDataURI({ dataURIService, metadata });

      expect(dataURIService.fetchImageDataUri).toHaveBeenCalled();
      expect(dataURIService.fetchOriginalDataUri).not.toHaveBeenCalled();
    });
  });

  describe('.render()', () => {
    it('should pass down dataURI when I have one', () => {
      const element = shallow<WithDataURIProps, WithDataURIState>(
        <DemoComponentWithDataURI />,
      );

      element.setState({ dataURI: 'data:png' });

      expect(element.find(DemoComponent).props().dataURI).toBe('data:png');
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

      expect(element.find(DemoComponent).prop('dataURIService')).toBe(
        undefined,
      );
    });
  });
});
