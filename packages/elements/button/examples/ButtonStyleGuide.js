// @flow
import React from 'react';
import Button from '../src';

const appearances = [
  'default',
  'primary',
  'link',
  'subtle',
  'subtle-link',
  'warning',
  'danger',
];
const selectableAppearances = ['default', 'primary'];

const Table = props => <div style={{ display: 'table' }} {...props} />;
const Row = props => <div style={{ display: 'table-row' }} {...props} />;
const Cell = props => (
  <div style={{ display: 'table-cell', padding: 4 }} {...props} />
);
const Btn = props => (
  <Cell>
    <Button {...props} />
  </Cell>
);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default () => (
  <Table>
    {appearances.map(a => (
      <Row key={a}>
        <Btn appearance={a}>{capitalize(a)}</Btn>
        <Btn appearance={a} isDisabled>
          Disabled
        </Btn>
        {selectableAppearances.includes(a) ? (
          <Btn appearance={a} isSelected>
            Selected
          </Btn>
        ) : null}
      </Row>
    ))}
  </Table>
);
