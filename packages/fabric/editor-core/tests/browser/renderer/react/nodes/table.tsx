import * as React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import Table from '../../../../../src/renderer/react/nodes/table';

describe('Renderer - React/Nodes/Table', () => {
  const table = shallow(<Table />);

  it('should create a <table>-tag', () => {
    expect(table.name()).to.equal('styled.table');
  });

});
