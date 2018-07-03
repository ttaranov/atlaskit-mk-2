import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Table from '../../../../react/nodes/table';

describe('Renderer - React/Nodes/Table', () => {
  const table = mount(<Table />);

  it('should create a <table>-tag', () => {
    expect(table.find('table').exists()).to.equal(true);
  });
});
