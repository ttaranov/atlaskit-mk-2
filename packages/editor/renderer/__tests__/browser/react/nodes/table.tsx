import * as React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import Table from '../../../../src/react/nodes/table';
import TableRow from '../../../../src/react/nodes/tableRow';
import TableHeader from '../../../../src/react/nodes/tableHeader';
import TableCell from '../../../../src/react/nodes/tableCell';

describe('Renderer - React/Nodes/Table', () => {
  const table = mount(<Table isNumberColumnEnabled={false} />);

  it('should create a <table>-tag', () => {
    expect(table.find('table').exists()).to.equal(true);
  });

  it('should have a number row if isNumberColumnEnabled is true', () => {
    const table = mount(
      <Table isNumberColumnEnabled={true}>
        <TableRow>
          <TableHeader>{'header cell'}</TableHeader>
        </TableRow>
        <TableCell>
          <TableHeader>{'table cell'}</TableHeader>
        </TableCell>
      </Table>
    );
    expect(table.find('th').length).to.equal(2);
    expect(table.find('td').length).to.equal(2);
  });
});
