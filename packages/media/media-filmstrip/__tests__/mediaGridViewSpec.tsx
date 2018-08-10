import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { gridItems } from '../example-helpers/media-grid-items';
import {
  EMPTY_GRID_ITEM,
  GridItem,
  MediaGridView,
} from '../src/mediaGrid/mediaGridView';
import { ImgWrapper, RowWrapper, Img } from '../src/mediaGrid/styled';

const gridItem = (index: number) => ({
  dataURI: `url-index-${index}`,
  dimensions: {
    width: 1000,
    height: 1000,
  },
});

const generateGridItems = (length: number) =>
  new Array(length).fill(null).map((el, index) => gridItem(index));

describe('MediaGridView', () => {
  let onItemsChange: jest.Mock<any>;
  beforeEach(() => {
    onItemsChange = jest.fn();
  });

  it('should render all the items', () => {
    const items: GridItem[] = generateGridItems(5);
    const component = shallow(
      <MediaGridView items={items} onItemsChange={onItemsChange} />,
    );
    expect(component.find(Img)).toHaveLength(5);
    expect(
      component
        .find(Img)
        .at(0)
        .props().src,
    ).toEqual('url-index-0');
    expect(
      component
        .find(Img)
        .at(4)
        .props().src,
    ).toEqual('url-index-4');
  });

  it('should have 3 rows with 3 items in a row', () => {
    const items: GridItem[] = generateGridItems(9);
    const component = shallow(
      <MediaGridView
        items={items}
        onItemsChange={onItemsChange}
        itemsPerRow={3}
      />,
    );
    expect(component.find(RowWrapper)).toHaveLength(3);
    expect(
      component
        .find(RowWrapper)
        .at(0)
        .find(Img),
    ).toHaveLength(3);
    expect(
      component
        .find(RowWrapper)
        .at(1)
        .find(Img),
    ).toHaveLength(3);
  });

  it('should have 3 items per row by default', () => {
    const items: GridItem[] = generateGridItems(9);
    const component = shallow(
      <MediaGridView items={items} onItemsChange={onItemsChange} />,
    );
    expect(
      component
        .find(RowWrapper)
        .at(0)
        .find(Img),
    ).toHaveLength(3);
  });

  it('should have 4 items per row', () => {
    const items: GridItem[] = generateGridItems(9);
    const component = shallow(
      <MediaGridView
        itemsPerRow={4}
        items={items}
        onItemsChange={onItemsChange}
      />,
    );
    expect(
      component
        .find(RowWrapper)
        .at(0)
        .find(Img),
    ).toHaveLength(4);
    expect(
      component
        .find(RowWrapper)
        .at(2)
        .find(Img),
    ).toHaveLength(1);
  });

  it('should have remaining items on last row', () => {
    const component = shallow(
      <MediaGridView
        itemsPerRow={5}
        items={gridItems.slice(0, 9)}
        onItemsChange={onItemsChange}
      />,
    );
    // First row 5
    // Second row 4
    expect(
      component
        .find(RowWrapper)
        .at(1)
        .find(Img),
    ).toHaveLength(4);
  });

  it('should choose appropriate height 1', () => {
    /*
    Original images sizes: {800x1600}, {1200x1600}.
    Total container width: 1010
    One margin width: 10
    Result: Images are resized in half
              1010
      _______________________
     |        | |            |
     |        | |            |
     |        | |            | 800
     |        | |            |
     |        | |            |
     |        | |            |
     |        | |            |
     |________|_|____________|
        400    10     600
     */
    const items: GridItem[] = [
      {
        dataURI: 'url-index-0',
        dimensions: {
          width: 800,
          height: 1600,
        },
      },
      {
        dataURI: 'url-index-1',
        dimensions: {
          width: 1200,
          height: 1600,
        },
      },
    ];
    const component = shallow(
      <MediaGridView
        items={items}
        width={1010}
        onItemsChange={onItemsChange}
      />,
    );

    // console.log(JSON.stringify(component.find(ImgWrapper).at(0).props(), null, 2))

    expect(
      component
        .find(ImgWrapper)
        .at(0)
        .props().style,
    ).toEqual({
      width: 400,
      height: 800,
    });
    expect(
      component
        .find(ImgWrapper)
        .at(1)
        .props().style,
    ).toEqual({
      width: 600,
      height: 800,
    });
  });

  it('should choose appropriate height 2', () => {
    /*
    Original images sizes: {400x800}, {3000x1200}.
    Total container width: 1210
    One margin width: 10
    Result: Images are resized in half
                   1210
      _________________________________
     |        | |                      |
     |        | |                      |
     |        | |                      |
     |        | |                      | 400
     |        | |                      |
     |        | |                      |
     |        | |                      |
     |________|_|______________________|
        200    10         1000
     */
    const items: GridItem[] = [
      {
        dataURI: 'url-index-0',
        dimensions: {
          width: 400,
          height: 800,
        },
      },
      {
        dataURI: 'url-index-1',
        dimensions: {
          width: 3000,
          height: 1200,
        },
      },
    ];
    const component = shallow(
      <MediaGridView
        items={items}
        width={1210}
        onItemsChange={onItemsChange}
      />,
    );
    expect(
      component
        .find(ImgWrapper)
        .at(0)
        .props().style,
    ).toEqual({
      width: 200,
      height: 400,
    });
    expect(
      component
        .find(ImgWrapper)
        .at(1)
        .props().style,
    ).toEqual({
      width: 1000,
      height: 400,
    });
  });

  it('should update items when images are loaded', () => {
    const items: GridItem[] = [
      {
        dataURI: 'url-index-0',
        dimensions: {
          width: 10,
          height: 10,
        },
      },
      {
        dataURI: 'url-index-1',
        dimensions: {
          width: 10,
          height: 10,
        },
      },
    ];
    const component = shallow(
      <MediaGridView items={items} onItemsChange={onItemsChange} />,
    );
    component
      .find(Img)
      .at(0)
      .props().onLoad!({} as any);
    expect(onItemsChange).toHaveBeenCalledWith([
      {
        dataURI: 'url-index-0',
        isLoaded: true,
        dimensions: {
          width: 10,
          height: 10,
        },
      },
      {
        dataURI: 'url-index-1',
        isLoaded: undefined,
        dimensions: {
          width: 10,
          height: 10,
        },
      },
    ]);
    component
      .find(Img)
      .at(1)
      .props().onLoad!({} as any);
    expect(onItemsChange).toHaveBeenCalledWith([
      {
        dataURI: 'url-index-0',
        isLoaded: undefined,
        dimensions: {
          width: 10,
          height: 10,
        },
      },
      {
        dataURI: 'url-index-1',
        isLoaded: true,
        dimensions: {
          width: 10,
          height: 10,
        },
      },
    ]);
  });

  it('should have 2 rows with 1 item in each row when empty media-item is present', () => {
    const items: GridItem[] = [
      // First row
      {
        dataURI: 'url-index-0',
        dimensions: {
          width: 1000,
          height: 1000,
        },
      },
      EMPTY_GRID_ITEM,
      EMPTY_GRID_ITEM,
      // Second row
      {
        dataURI: 'url-index-1',
        dimensions: {
          width: 500,
          height: 250,
        },
      },
    ];
    const component = shallow(
      <MediaGridView
        items={items}
        width={100}
        itemsPerRow={3}
        onItemsChange={onItemsChange}
      />,
    );
    expect(component.find(RowWrapper)).toHaveLength(2);
    const firstRowImageWrapper = component
      .find(RowWrapper)
      .at(0)
      .find(ImgWrapper);
    const secondRowImageWrapper = component
      .find(RowWrapper)
      .at(1)
      .find(ImgWrapper);
    expect(firstRowImageWrapper).toHaveLength(1);
    expect(secondRowImageWrapper).toHaveLength(1);
  });

  describe('select', () => {
    it('first image should be deleted by Backspace keypress when selected', () => {
      const items: GridItem[] = generateGridItems(5);
      const component = shallow(
        <MediaGridView
          items={items}
          width={100}
          itemsPerRow={3}
          onItemsChange={onItemsChange}
        />,
      );

      // Select image
      component
        .find(Img)
        .first()
        .simulate('click');

      // Delete selected image
      (component.instance() as MediaGridView).onKeyDown(
        new KeyboardEvent('keydown', { key: 'Backspace' }),
      );

      expect(onItemsChange).toHaveBeenCalledWith([
        { dataURI: 'url-index-1', dimensions: { height: 1000, width: 1000 } },
        { dataURI: 'url-index-2', dimensions: { height: 1000, width: 1000 } },
        { dimensions: { height: 0, width: 0 } },
        { dataURI: 'url-index-3', dimensions: { height: 1000, width: 1000 } },
        { dataURI: 'url-index-4', dimensions: { height: 1000, width: 1000 } },
      ]);
    });

    it('should select second last image after last image selected and deleted', () => {
      const items: GridItem[] = generateGridItems(5);
      const onChange = jest.fn().mockImplementation(items => items);

      class Wrapper extends React.Component {
        state = {
          items,
        };
        onItemsChange = items => {
          // console.log('onItemsChange', items)
          this.setState({ items });
          onChange(items);
        };

        render() {
          const { items } = this.state;
          return (
            <MediaGridView
              items={items}
              width={100}
              itemsPerRow={3}
              onItemsChange={this.onItemsChange}
            />
          );
        }
      }

      const component = mount(<Wrapper />);

      component
        .find(Img)
        .last()
        .simulate('click');

      // Hit delete key twice
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Backspace' }),
      );
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Backspace' }),
      );
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange.mock.calls[0]).toEqual([
        [
          { dataURI: 'url-index-0', dimensions: { height: 1000, width: 1000 } },
          { dataURI: 'url-index-1', dimensions: { height: 1000, width: 1000 } },
          { dataURI: 'url-index-2', dimensions: { height: 1000, width: 1000 } },
          { dataURI: 'url-index-3', dimensions: { height: 1000, width: 1000 } },
        ],
      ]);
      expect(onChange.mock.calls[1]).toEqual([
        [
          { dataURI: 'url-index-0', dimensions: { height: 1000, width: 1000 } },
          { dataURI: 'url-index-1', dimensions: { height: 1000, width: 1000 } },
          { dataURI: 'url-index-2', dimensions: { height: 1000, width: 1000 } },
        ],
      ]);
    });
  });

  describe('delete', () => {
    it('should replace deleted item with empty grid item when there is non-empty item in this row', () => {
      const items: GridItem[] = generateGridItems(5);
      const component = shallow(
        <MediaGridView
          items={items}
          width={100}
          itemsPerRow={3}
          onItemsChange={onItemsChange}
        />,
      );
      (component.instance() as MediaGridView).deleteImage(3);
      expect(onItemsChange).toHaveBeenCalledWith([
        // First row
        {
          dataURI: 'url-index-0',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
        {
          dataURI: 'url-index-1',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
        {
          dataURI: 'url-index-2',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
        // Second row
        {
          dataURI: 'url-index-4',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
      ]);
    });

    it('should delete all items in a row when last non-empty item in that row is deleted', () => {
      const items: GridItem[] = [
        // First Row
        {
          dataURI: 'url-index-0',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
        {
          dataURI: 'url-index-1',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
        EMPTY_GRID_ITEM,
        // Second Row
        {
          dataURI: 'url-index-4',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
      ];
      const component = shallow(
        <MediaGridView
          items={items}
          width={100}
          itemsPerRow={3}
          onItemsChange={onItemsChange}
        />,
      );
      (component.instance() as MediaGridView).deleteImage(3);
      expect(onItemsChange).toHaveBeenCalledWith([
        // First Row
        {
          dataURI: 'url-index-0',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
        {
          dataURI: 'url-index-1',
          dimensions: {
            width: 1000,
            height: 1000,
          },
        },
      ]);
    });
  });

  describe('move', () => {
    type IndexOrNull = number | null;
    const indeciesToMediaItems = (indecies: IndexOrNull[]) =>
      indecies.map(
        (indexOrNull: IndexOrNull) =>
          indexOrNull === null ? EMPTY_GRID_ITEM : gridItem(indexOrNull),
      );

    const mediaItemToIndex = (gridItem: GridItem) =>
      !!gridItem.dataURI ? +gridItem.dataURI.match(/.*-(\d+)/)![1] : null;

    const mediaItemsToIndecies = (gridItems: GridItem[]) =>
      gridItems.map(mediaItemToIndex);

    const assertMove = (
      fromIndex: number,
      toIndex: number,
      inIndecies: IndexOrNull[],
      outIndecies: IndexOrNull[],
    ) => {
      const items: GridItem[] = indeciesToMediaItems(inIndecies);
      const component = shallow(
        <MediaGridView
          itemsPerRow={3}
          items={items}
          onItemsChange={onItemsChange}
        />,
      );
      const instance = component.instance() as MediaGridView;
      instance.state = {
        ...instance.state,
        dropIndex: toIndex,
        isDragging: true,
        draggingIndex: fromIndex,
      };
      instance.moveImage();
      expect(mediaItemsToIndecies(onItemsChange.mock.calls[0][0])).toEqual(
        outIndecies,
      );
    };

    it('should move item from back to front and shift everything after insertion index', () => {
      assertMove(3, /* → */ 0, [0, 1, 2, 3, 4, 5], [3, 0, 1, 2, 4, 5]);
    });

    it('should move item from front to back and shift everything after insertion index', () => {
      assertMove(0, /* → */ 4, [0, 1, 2, 3, 4, 5], [1, 2, null, 3, 0, 4, 5]);
    });

    it('should move item from row of 2 to row of 2', () => {
      assertMove(
        3,
        /* → */ 1,
        [0, 1, null, 3, 4, null, 6],
        [0, 3, 1, 4, null, null, 6],
      );
    });

    it('should swap two items on the same row', () => {
      assertMove(
        0,
        /* → */ 2,
        [0, 1, 2, 3, 4, null, 6],
        [1, 0, 2, 3, 4, null, 6],
      );
    });

    it('should push out empty spot', () => {
      assertMove(6, /* → */ 3, [0, 1, 2, 3, 4, null, 6], [0, 1, 2, 6, 3, 4]);
    });

    it('should not leave empty line when last item is moved', () => {
      assertMove(
        3,
        /* → */ 6,
        [0, 1, 2, 3, null, null, 6, 7],
        [0, 1, 2, 3, 6, 7],
      );
    });
  });
});
