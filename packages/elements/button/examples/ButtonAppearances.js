import React from 'react';
import Btn from '@atlaskit/button';

const appearances = [
  'default',
  'primary',
  'link',
  'subtle',
  'subtle-link',
  'warning',
  'danger',
  'help',
];
const selectableAppearances = ['default', 'primary'];

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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const ButtonAppearance = () => (
  <Table>
    {appearances.map((a, i) => (
      <Row key={i}>
        <Button appearance={a}>{capitalize(a)}</Button>
        <Button appearance={a} isDisabled>
          Disabled
        </Button>
        {selectableAppearances.includes(a) ? (
          <Button appearance={a} isSelected>
            Selected
          </Button>
        ) : null}
      </Row>
    ))}
  </Table>
);

export default ButtonAppearance;
