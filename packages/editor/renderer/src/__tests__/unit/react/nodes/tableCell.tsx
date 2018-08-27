import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import TableCell from '../../../../react/nodes/tableCell';

describe('Renderer - React/Nodes/TableCell', () => {
  const baseProps = {
    colspan: 6,
    rowspan: 3,
    background: '#fab',
  };

  it('should create a <td>-tag', () => {
    const tableCell = shallow(<TableCell />);
    expect(tableCell.name()).to.equal('td');
  });

  it('should render the <td> props', () => {
    const tableRow = shallow(<TableCell {...baseProps} />);
    expect(tableRow.name()).to.equal('td');

    expect(tableRow.prop('rowSpan')).to.equal(3);
    expect(tableRow.prop('colSpan')).to.equal(6);

    expect(tableRow.prop('style')).to.deep.equal({
      'background-color': 'rgba(255,170,187,0.5)',
    });
  });
});
