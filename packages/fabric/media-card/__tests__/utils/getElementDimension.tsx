jest.mock('react-dom');
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getElementDimension } from '../../src/utils/getElementDimension';

describe('getElementDimension', () => {
  it('should return a rounded value for the passed dimension', () => {
    const element = {
      getBoundingClientRect() {
        return {
          width: 1.1,
          height: 10.2,
        };
      },
    };
    (ReactDOM.findDOMNode as jest.Mock<void>).mockReturnValue(element);
    const width = getElementDimension(null, 'width');
    const height = getElementDimension(null, 'height');

    expect(width).toEqual(1);
    expect(height).toEqual(10);
  });
});
