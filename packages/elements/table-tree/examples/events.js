// @flow
import React, { PureComponent } from 'react';
import TableTree, { Headers, Header, Rows, Row, Cell } from '../src';
import staticData from './data-cleancode-toc.json';

function fetchRoots() {
  return Promise.resolve(staticData.children);
}

function fetchChildrenOf(node) {
  return Promise.resolve(node.children);
}

function getItemsData(parent) {
  return parent ? fetchChildrenOf(parent) : fetchRoots();
}

type State = {
  lastEvent: string,
};

export default class extends PureComponent<{}, State> {
  state = {
    lastEvent: '',
  };

  triggerEvent(name: string) {
    this.setState({
      lastEvent: name,
    });
  }

  render() {
    const { lastEvent } = this.state;
    return (
      <div>
        <TableTree>
          <Headers>
            <Header
              width={200}
              onClick={() => this.triggerEvent('Header Clicked (chapter)')}
            >
              Chapter title
            </Header>
            <Header
              width={100}
              onClick={() => this.triggerEvent('Header Clicked (numbering)')}
            >
              Numbering
            </Header>
            <Header
              width={100}
              onClick={() => this.triggerEvent('Header Clicked (page)')}
            >
              Page
            </Header>
          </Headers>
          <Rows
            items={getItemsData}
            render={({ title, numbering, page, children }) => (
              <Row
                key={numbering}
                hasChildren={children.length > 0}
                onExpand={() => this.triggerEvent(`Node Expanded (${title})`)}
                onCollapse={() =>
                  this.triggerEvent(`Node Collapsed (${title})`)
                }
              >
                <Cell singleLine>{title}</Cell>
                <Cell>{numbering}</Cell>
                <Cell>{page}</Cell>
              </Row>
            )}
          />
        </TableTree>
        <p>
          {lastEvent ? (
            <span>
              <strong>Last event: </strong> {lastEvent}
            </span>
          ) : (
            <i>Click around to see events</i>
          )}
        </p>
      </div>
    );
  }
}
