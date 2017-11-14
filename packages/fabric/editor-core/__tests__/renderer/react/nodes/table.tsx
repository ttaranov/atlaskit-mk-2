import * as React from 'react';
import { shallow } from 'enzyme';
import Table from '../../../../src/renderer/react/nodes/table';

describe('Renderer - React/Nodes/Table', () => {
  const table = shallow(<Table />);

  it('should create a <table>-tag', () => {
    expect(table.name()).toEqual('styled.table');
  });

});
