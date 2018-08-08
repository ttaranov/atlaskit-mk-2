import * as React from 'react';
import { shallow } from 'enzyme';
import { gridItems } from '../example-helpers/media-grid-items';
import { GridItem, MediaGridView } from '../src/mediaGrid/mediaGridView';
import { RowWrapper, Img, ImgWrapper } from '../src/mediaGrid/styled';

describe('MediaGridView', () => {
  let onItemsChange: jest.Mock<any>;
  beforeEach(() => {
    onItemsChange = jest.fn();
  });

  it('should render all the items', () => {
    const numberOfItems = gridItems.length;
    const component = shallow(
      <MediaGridView items={gridItems} onItemsChange={onItemsChange} />,
    );
    expect(component.find(Img)).toHaveLength(numberOfItems);
    expect(
      component
        .find(Img)
        .at(0)
        .props().src,
    ).toEqual(gridItems[0].dataURI);
    expect(
      component
        .find(Img)
        .at(gridItems.length - 1)
        .props().src,
    ).toEqual(gridItems[gridItems.length - 1].dataURI);
  });

  it('should have 3 rows with 3 items in a row', () => {
    const component = shallow(
      <MediaGridView
        items={gridItems.slice(0, 9)}
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
  });

  it('should have 3 items per row by default', () => {
    const component = shallow(
      <MediaGridView
        items={gridItems.slice(0, 9)}
        onItemsChange={onItemsChange}
      />,
    );
    expect(
      component
        .find(RowWrapper)
        .at(0)
        .find(Img),
    ).toHaveLength(3);
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
        dataURI: 'some-url-1',
        dimensions: {
          width: 800,
          height: 1600,
        },
      },
      {
        dataURI: 'some-url-2',
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
        dataURI: 'some-url-1',
        dimensions: {
          width: 400,
          height: 800,
        },
      },
      {
        dataURI: 'some-url-2',
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
});
