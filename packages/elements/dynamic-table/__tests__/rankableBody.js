// @flow
import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { mount, shallow } from 'enzyme';
import { RankableBody } from '../src/components/rankable/Body';

import { rowsWithKeys, head } from './_data';


describe('rankable/Body', () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      head,
      isFixedSize: false,
      onRankStart: jest.fn(),
      onRankEnd: jest.fn(),
      isRanking: false,
      innerRef: jest.fn(),
      refWidth: -1,
      refHeight: -1,
      pageRows: rowsWithKeys,
    }
  })


  it('only one DragDropContext and Droppable are rendered', () => {
    const wrapper = mount(
      <table>
        <RankableBody 
          {...defaultProps}
          />
      </table>
    );

    const dragDropContext = wrapper.find(DragDropContext);
    const droppable = wrapper.find(Droppable);
    const draggable = wrapper.find(Draggable);

    expect(dragDropContext).toHaveLength(1);
    expect(droppable).toHaveLength(1);
    expect(draggable).toHaveLength(rowsWithKeys.length);
  });

  it('width is set when table is in ranking state', () => {
    const width = 1000;
    const height = 500;

    const wrapper = mount(<table>
      <RankableBody 
          {...defaultProps}
          isRanking
          refWidth={width}
          refHeight={height}
        />
      </table>);

      const body = wrapper.find('tbody');
      expect(body.props().style.height).toBe(height);
      expect(body.props().style.width).toBe(width);
  });

  it('width is not set when table is not in ranking state', () => {
    const width = 1000;
    const height = 500;

    const wrapper = mount(<table>
      <RankableBody 
          {...defaultProps}
          isRanking={false}
          refWidth={width}
          refHeight={height}
        />
      </table>);

      const body = wrapper.find('tbody');
      expect(body.props().style).toEqual({});
  });

  describe('onDragStart', () => {
    it('onRankStart is called with proper arguments', () => {
      const key = 'draggable-id';
      const index = 1;

      const wrapper = shallow(<RankableBody 
          {...defaultProps}
          isRanking
        />);
  
        const dndContext = wrapper.find(DragDropContext);
        dndContext.simulate('dragStart', {
          draggableId: key,
          source: { index }
        });

        const onRankStart = defaultProps.onRankStart;
        expect(onRankStart).toHaveBeenCalledTimes(1);
        expect(onRankStart).toHaveBeenLastCalledWith({ key, index });
    });
  });

  describe('onDragEnd', () => {
    const createDragEndProps = (sourceKey, sourceIndex, destinationIndex=null) => {
      return {
        draggableId: sourceKey,
        source: {
          index: sourceIndex,
        },
        destination: destinationIndex !== null ? {
          index: destinationIndex,
        } : undefined,
      }
    }

    it('onRankEnd is called with proper empty destination if drag was cancelled', () => {
      const sourceKey = 'source-key-draggable';
      const sourceIndex = 1;

      const wrapper = shallow(<RankableBody 
        {...defaultProps}
      />);

      const dndContext = wrapper.find(DragDropContext);
      dndContext.simulate('dragEnd', createDragEndProps(sourceKey, sourceIndex));

      const onRankEnd = defaultProps.onRankEnd;
      expect(onRankEnd).toHaveBeenCalledTimes(1);
      expect(onRankEnd).toHaveBeenLastCalledWith({ sourceKey, sourceIndex });
    });

    const testOnRankEnd = (sourceIndex, destinationIndex, afterKey, beforeKey) => {
      const sourceKey = 'source-key-draggable';

      const wrapper = shallow(<RankableBody 
          {...defaultProps}
      />);

      const dndContext = wrapper.find(DragDropContext);
      dndContext.simulate('dragEnd', createDragEndProps(sourceKey, sourceIndex, destinationIndex));

      const onRankEnd = defaultProps.onRankEnd;
      expect(onRankEnd).toHaveBeenCalledTimes(1);
      expect(onRankEnd).toHaveBeenLastCalledWith({ 
        sourceKey, 
        sourceIndex,
        destination: {
          index: destinationIndex,
          afterKey,
          beforeKey,
        }
      });
    }

    const getKey = index => rowsWithKeys[index].key;

    it('onRankEnd is called with proper destination if was dropped on fist position', () => {
      testOnRankEnd(2, 0, undefined, getKey(0))
    });

    it('onRankEnd is called with proper destination if was dropped in the middle of list (move to the greater index)', () => {
      testOnRankEnd(0, 2, getKey(2), getKey(3));
    });

    it('onRankEnd is called with proper destination if was dropped in the middle of list before an item', () => {
      testOnRankEnd(3, 1, getKey(0), getKey(1));
    });

    it('onRankEnd is called with proper destination if was dropped on the last position', () => {
      const lastIndex = rowsWithKeys.length - 1;
      testOnRankEnd(1, lastIndex, getKey(lastIndex), undefined);
    });
  });

});
