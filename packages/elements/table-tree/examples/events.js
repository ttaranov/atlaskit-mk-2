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
  eventsLog: Array<string>,
};

export default class extends PureComponent<{}, State> {
  state: State = {
    eventsLog: [],
  };

  triggerEvent(name: string) {
    this.setState({
      eventsLog: [...this.state.eventsLog, name],
    });
  }

  render() {
    const events = this.state.eventsLog;
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
            onItemsRendered={(parentData, itemsData) => {
              this.triggerEvent(
                `Items rendered ${
                  parentData
                    ? `(${itemsData.length} children of ‘${parentData.title}’)`
                    : `(${itemsData.length} roots)`
                }`,
              );
            }}
            render={({ title, numbering, page, children }) => (
              <Row
                key={numbering}
                hasChildren={children.length > 0}
                onExpand={() => this.triggerEvent(`Node Expanded (‘${title}’)`)}
                onCollapse={() =>
                  this.triggerEvent(`Node Collapsed (‘${title}’)`)
                }
              >
                <Cell singleLine>{title}</Cell>
                <Cell>{numbering}</Cell>
                <Cell>{page}</Cell>
              </Row>
            )}
          />
        </TableTree>
        <section style={{ 'margin-top': '20px' }}>
          <h4>Events</h4>
          <div style={{ overflow: 'scroll', 'max-height': '5.0em' }}>
            {events.length > 0 ? (
              events
                .map((event, i) => [event, i + 1])
                .reverse()
                .map(([event, n]) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={n}>
                    {n}. {event}
                  </div>
                ))
            ) : (
              <p>
                <i>Click around to see events</i>
              </p>
            )}
          </div>
        </section>
      </div>
    );
  }
}
