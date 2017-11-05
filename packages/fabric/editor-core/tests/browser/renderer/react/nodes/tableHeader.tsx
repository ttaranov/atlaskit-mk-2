import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import TableHeader from '../../../../../src/renderer/react/nodes/tableHeader';

describe('Renderer - React/Nodes/TableHeader', () => {
  const tableHeader = shallow(<TableHeader />);

  it('should create a <th>-tag', () => {
    expect(tableHeader.name()).to.equal('th');
  });

});
