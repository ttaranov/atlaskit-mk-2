// @flow
import React from 'react';
import Btn from '../src';

const Table = props => <div style={{ display: 'table' }} {...props} />;
const Row = props => <div style={{ display: 'table-row' }} {...props} />;
const Cell = props => (
  <div style={{ display: 'table-cell', padding: 4 }} {...props} />
);
const Button = props => (
  <Cell>
    <Btn {...props} />
  </Cell>
);

const ButtonSpacing = () => (
  <Table>
    <Row>
      <Button>Default</Button>
      <Button spacing="compact">Compact</Button>
    </Row>
    <Row>
      <Button appearance="link">Default</Button>
      <Button appearance="link" spacing="compact">
        Compact
      </Button>
      <Button appearance="link" spacing="none">
        None
      </Button>
    </Row>
  </Table>
);

export default ButtonSpacing;
