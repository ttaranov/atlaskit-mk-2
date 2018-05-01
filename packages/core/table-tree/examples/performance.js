// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Select from '@atlaskit/select';
import TableTree, { Headers, Header, Rows, Row, Cell } from '../src';

function getItemsData(parent, count) {
  return generateChildItems(parent || { numberingPath: '' }, count);
}

function generateChildItems(parent, count) {
  const items = new Array(count);
  for (let i = 0; i < count; i++) {
    const number = i + 1;
    const numbering = `${parent.numberingPath}${number}`;
    items.push({
      numbering,
      title: `Item ${numbering}`,
      numberingPath: `${numbering}.`,
    });
  }
  return items;
}

const PerformanceTweakContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  background: rgba(100%, 100%, 100%, 0.8);
  border: 5px solid rgba(0, 0, 0, 0.8);
  border-width: 5px 0 0 5px;
  padding: 20px;
  width: 450px;
`;

type State = {
  childCount: number,
  totalCount: number,
  // flowlint-next-line unclear-type:off
  selectedChildCountOption: Object,
};

const childCountPerItem = 100;

export default class extends PureComponent<{}, State> {
  childCountOptions = [
    {
      label: 10,
      value: 10,
    },
    {
      label: 20,
      value: 20,
    },
    {
      label: 50,
      value: 50,
    },
    {
      label: 100,
      value: 100,
    },
    {
      label: 200,
      value: 200,
    },
    {
      label: 500,
      value: 500,
    },
    {
      label: 1000,
      value: 1000,
    },
  ];

  state: State = {
    childCount: childCountPerItem,
    totalCount: childCountPerItem,
    selectedChildCountOption: this.childCountOptions[3],
  };

  // flowlint-next-line unclear-type:off
  getItems = (parent: ?Object) =>
    getItemsData(parent, this.state.selectedChildCountOption.value);

  handleExpand = () => {
    this.setState({
      totalCount:
        this.state.totalCount + this.state.selectedChildCountOption.value,
    });
  };

  // flowlint-next-line unclear-type:off
  handleItemsCountChange = (option: Object) => {
    this.setState({ selectedChildCountOption: option });
  };

  render() {
    return (
      <div style={{ position: 'relative' }}>
        <TableTree>
          <Headers>
            <Header width={300}>Chapter title</Header>
            <Header width={100}>Numbering</Header>
            <Header width={100}>Stuff</Header>
          </Headers>
          <Rows
            items={this.getItems}
            render={({ title, numbering }) => (
              <Row itemId={numbering} hasChildren onExpand={this.handleExpand}>
                <Cell singleLine>{title}</Cell>
                <Cell singleLine>{numbering}</Cell>
                <Cell singleLine>
                  <strong>B</strong>
                  <em>I</em>
                </Cell>
              </Row>
            )}
          />
        </TableTree>
        <PerformanceTweakContainer>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>Tree children per item:</div>
            <div style={{ width: '90px', margin: '0 20px 0 10px' }}>
              <Select
                hasAutocomplete={false}
                shouldFocus={false}
                options={this.childCountOptions}
                onChange={this.handleItemsCountChange}
                value={this.state.selectedChildCountOption}
                placeholder="choose"
              />
            </div>
            <div>
              Items loaded total: <strong>{this.state.totalCount}</strong>
            </div>
          </div>
        </PerformanceTweakContainer>
      </div>
    );
  }
}
