// @flow
import React, { Component, Fragment } from 'react';
import { Checkbox } from '@atlaskit/checkbox';
import Button from '../src';

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

export default class ButtonAppearance extends Component<*, *> {
  state = { showLoadingState: false };

  render() {
    const { showLoadingState } = this.state;

    return (
      <Fragment>
        <Checkbox
          value="showLoading"
          label="Show Loading State"
          onChange={({ target }) =>
            this.setState({ showLoadingState: target.checked })
          }
          name="show-loading"
        />
        <Table>
          {appearances.map(a => (
            <Row key={a}>
              <Btn isLoading={showLoadingState} appearance={a}>
                {capitalize(a)}
              </Btn>
              <Btn isLoading={showLoadingState} appearance={a} isDisabled>
                Disabled
              </Btn>
              <Btn isLoading={showLoadingState} appearance={a} isSelected>
                Selected
              </Btn>
            </Row>
          ))}
        </Table>
      </Fragment>
    );
  }
}
