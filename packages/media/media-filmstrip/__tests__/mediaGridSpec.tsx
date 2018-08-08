import * as React from 'react';
import { shallow } from 'enzyme';
import {
  MediaGrid,
  PublicGridItem,
  MediaGridProps,
  updatePopulatedItems,
  PopulatedItem,
} from '../src';
import { fakeContext } from '@atlaskit/media-test-helpers';
import { MediaGridView, GridItem } from '../src/mediaGrid/mediaGridView';

describe('<MediaGrid />', () => {
  const defaultDimensions = {
    width: 10,
    height: 5,
  };
  const setup = (props?: Partial<MediaGridProps>) => {
    const items: PublicGridItem[] = [
      {
        id: '1',
        dimensions: defaultDimensions,
        collectionName: 'some-collection',
      },
      {
        id: '2',
        dimensions: {
          width: 100,
          height: 50,
        },
      },
    ];
    const context = fakeContext();
    const component = shallow(
      <MediaGrid context={context} items={items} {...props} />,
    );

    return {
      component,
      context,
    };
  };

  it('should initially render items without dataURI', () => {
    const { component } = setup();

    expect(component.find(MediaGridView)).toHaveLength(1);
    expect(component.find(MediaGridView).prop('items')).toEqual([
      {
        dataURI: undefined,
        dimensions: {
          width: 10,
          height: 5,
        },
        isLoaded: undefined,
      },
      {
        dataURI: undefined,
        dimensions: {
          width: 100,
          height: 50,
        },
        isLoaded: undefined,
      },
    ]);
  });

  it('should handle items change', () => {
    const populatedItems: PopulatedItem[] = [
      {
        id: '1',
        dimensions: defaultDimensions,
        dataURI: 'image/1',
      },
      {
        id: '2',
        dimensions: defaultDimensions,
        dataURI: 'image/2',
      },
    ];
    const gridItems: GridItem[] = [
      {
        dataURI: 'image/1',
        dimensions: defaultDimensions,
        isLoaded: true,
      },
      {
        dataURI: 'image/2',
        dimensions: defaultDimensions,
        isLoaded: false,
      },
    ];
    const newPopulatedItems = updatePopulatedItems(populatedItems, gridItems);

    expect(newPopulatedItems).toEqual([
      {
        id: '1',
        dimensions: defaultDimensions,
        dataURI: 'image/1',
        isLoaded: true,
      },
      {
        id: '2',
        dimensions: defaultDimensions,
        dataURI: 'image/2',
        isLoaded: false,
      },
    ]);
  });

  it('should set file previews for each item', async () => {
    const context = fakeContext() as any;
    const getImageUrlResponse = Promise.resolve('some-url');
    context.getImageUrl.mockReturnValue(getImageUrlResponse);

    const { component } = setup({ context });
    await getImageUrlResponse;

    component.update();

    expect(context.getImageUrl).toHaveBeenCalledTimes(2);
    expect(context.getImageUrl.mock.calls[0]).toEqual([
      '1',
      {
        width: 10,
        height: 5,
        collection: 'some-collection',
      },
    ]);
    expect(context.getImageUrl.mock.calls[1]).toEqual([
      '2',
      {
        width: 100,
        height: 50,
      },
    ]);
    expect(component.find(MediaGridView).prop('items')).toEqual([
      {
        dataURI: 'some-url',
        dimensions: {
          width: 10,
          height: 5,
        },
        isLoaded: undefined,
      },
      {
        dataURI: 'some-url',
        dimensions: {
          width: 100,
          height: 50,
        },
        isLoaded: undefined,
      },
    ]);
  });

  it('should pass options down to MediaGridView', () => {
    const { component } = setup({
      isInteractive: false,
      width: 5,
      itemsPerRow: 4,
    });

    expect(component.find(MediaGridView).props()).toEqual(
      expect.objectContaining({
        isInteractive: false,
        width: 5,
        itemsPerRow: 4,
      }),
    );
  });
});
