import * as React from 'react';
import { shallow } from 'enzyme';
import TableCell from '../../../../src/renderer/react/nodes/tableCell';

describe('Renderer - React/Nodes/TableCell', () => {
  const tableCell = shallow(<TableCell />);

  it('should create a <td>-tag', () => {
    expect(tableCell.name()).toEqual('td');
  });

});
