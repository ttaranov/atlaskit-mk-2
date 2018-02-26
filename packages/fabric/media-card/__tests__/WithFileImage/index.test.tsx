jest.mock('../../src/utils/getElementDimension');
jest.mock('../../src/utils/isRetina');

import * as React from 'react';
import { shallow } from 'enzyme';
import { FileDetails, Context } from '@atlaskit/media-core';
import WithFileImage from '../../src/WithFileImage';
import { getElementDimension } from '../../src/utils/getElementDimension';
import { isRetina } from '../../src/utils/isRetina';
import { fakeContext } from '@atlaskit/media-test-helpers';

const details1: FileDetails = {
  id: '123',
  artifacts: {},
};

const details2: FileDetails = {
  id: '456',
  artifacts: {},
};

const context1 = fakeContext({
  getDataUriService: {
    fetchImageDataUri: jest.fn(file =>
      Promise.resolve(file.details.id === '123' ? 'abc' : 'def'),
    ),
  },
});

const context2 = fakeContext({
  getDataUriService: {
    fetchImageDataUri: jest.fn(file =>
      Promise.resolve(file.details.id === '123' ? 'uvw' : 'xyz'),
    ),
  },
});

const render = jest.fn();

async function waitForImageToLoad(context: Context) {
  await context
    .getDataUriService()
    .fetchImageDataUri({ type: 'file', details: {} }, { width: 0, height: 0 });
}

describe('WithFileImage', () => {
  beforeEach(() => {
    render.mockClear();
  });

  it('should clear the image when the context changes', async () => {
    const element = shallow(
      <WithFileImage context={context1} details={details1}>
        {render}
      </WithFileImage>,
    );

    // wait for the image to load
    await waitForImageToLoad(context1);
    element.update();
    expect(render).toHaveBeenLastCalledWith({ src: 'abc' });

    // change the context
    element.setProps({ context: context2 });
    expect(render).toHaveBeenLastCalledWith({ src: undefined });
  });

  it('should fetch the image when the context changes', async () => {
    const element = shallow(
      <WithFileImage context={context1} details={details1}>
        {render}
      </WithFileImage>,
    );

    // wait for the image to load
    await waitForImageToLoad(context1);
    element.update();
    expect(render).toHaveBeenLastCalledWith({ src: 'abc' });

    // change the context
    element.setProps({ context: context2 });

    // wait for the image to load
    await waitForImageToLoad(context2);
    element.update();
    expect(render).toHaveBeenLastCalledWith({ src: 'uvw' });
  });

  it('should clear the image when the details change', async () => {
    const element = shallow(
      <WithFileImage context={context1} details={details1}>
        {render}
      </WithFileImage>,
    );

    // wait for the image to load
    await waitForImageToLoad(context1);
    element.update();
    expect(render).toHaveBeenLastCalledWith({ src: 'abc' });

    // change the details
    element.setProps({ details: details2 });
    expect(render).toHaveBeenLastCalledWith({ src: undefined });
  });

  it('should fetch the image when the details change', async () => {
    const element = shallow(
      <WithFileImage context={context1} details={details1}>
        {render}
      </WithFileImage>,
    );

    // wait for the image to load
    await waitForImageToLoad(context1);
    element.update();
    expect(render).toHaveBeenLastCalledWith({ src: 'abc' });

    // change the details
    element.setProps({ details: details2 });

    // wait for the image to load
    await waitForImageToLoad(context1);
    element.update();
    expect(render).toHaveBeenLastCalledWith({ src: 'def' });
  });

  it('should get an unanimated image false when appearance is small', async () => {
    shallow(
      <WithFileImage context={context1} details={details1} appearance="small">
        {render}
      </WithFileImage>,
    );

    expect(
      context1.getDataUriService().fetchImageDataUri,
    ).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.objectContaining({
        allowAnimated: false,
      }),
    );
  });

  it('should get an animated image when appearance is not small', async () => {
    shallow(
      <WithFileImage
        context={context1}
        details={details1}
        appearance="horizontal"
      >
        {render}
      </WithFileImage>,
    );

    expect(
      context1.getDataUriService().fetchImageDataUri,
    ).toHaveBeenLastCalledWith(
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
      shallow(
        <WithFileImage
          context={context1}
          details={details1}
          dimensions={percentageDimensions}
        >
          {render}
        </WithFileImage>,
      );

      expect(context1.getDataUriService().fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 500 * 2,
          height: 200 * 2,
        }),
      );
    });

    it('should call fetchImageDataUri with given dimensions, even if they use pixels', () => {
      shallow(
        <WithFileImage
          context={context1}
          details={details1}
          dimensions={pixelDimensions}
        >
          {render}
        </WithFileImage>,
      );

      expect(context1.getDataUriService().fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 300 * 2,
          height: 200 * 2,
        }),
      );
    });

    it('should return default dimensions when small appeareance is passed', () => {
      shallow(
        <WithFileImage
          context={context1}
          details={details1}
          dimensions={percentageDimensions}
          appearance="small"
        >
          {render}
        </WithFileImage>,
      );

      expect(context1.getDataUriService().fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 32 * 2,
          height: 32 * 2,
        }),
      );
    });

    it('should return default dimensions when invalid dimension value is passed', () => {
      shallow(
        <WithFileImage
          context={context1}
          details={details1}
          dimensions={invalidDimensions}
        >
          {render}
        </WithFileImage>,
      );

      expect(context1.getDataUriService().fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 156 * 2,
          height: 125 * 2,
        }),
      );
    });

    it('should return passed dimension when dimension are valid', () => {
      shallow(
        <WithFileImage
          context={context1}
          details={details1}
          dimensions={dimensions}
        >
          {render}
        </WithFileImage>,
      );

      expect(context1.getDataUriService().fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 50 * 2,
          height: 100 * 2,
        }),
      );
    });

    it('should fetch dimensions with original size for non retina displays', () => {
      (isRetina as jest.Mock<void>).mockReturnValue(false);
      shallow(
        <WithFileImage
          context={context1}
          details={details1}
          dimensions={dimensions}
        >
          {render}
        </WithFileImage>,
      );

      expect(context1.getDataUriService().fetchImageDataUri).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          width: 50,
          height: 100,
        }),
      );
    });
  });
});
