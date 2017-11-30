import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import TableRow from '../../../../src/react/nodes/tableRow';

describe('Renderer - React/Nodes/TableRow', () => {
  const tableRow = shallow(<TableRow />);

  it('should create a <tr>-tag', () => {
    expect(tableRow.name()).to.equal('tr');
  });
});
