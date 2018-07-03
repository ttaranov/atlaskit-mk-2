import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import TableHeader from '../../../../react/nodes/tableHeader';

describe('Renderer - React/Nodes/TableHeader', () => {
  const baseProps = {
    colspan: 6,
    rowspan: 3,
    background: '#fab',
  };

  it('should create a <th>-tag', () => {
    const tableHeader = shallow(<TableHeader />);
    expect(tableHeader.name()).to.equal('th');
  });

  it('should render the <th> props', () => {
    const tableHeader = shallow(<TableHeader {...baseProps} />);
    expect(tableHeader.name()).to.equal('th');

    expect(tableHeader.prop('rowSpan')).to.equal(3);
    expect(tableHeader.prop('colSpan')).to.equal(6);

    expect(tableHeader.prop('style')).to.deep.equal({
      'background-color': '#fab',
    });
  });
});
