// @flow
import React from 'react';
import Button from '@atlaskit/button';
import staticData from './data-cleancode-toc.json';
import TableTree, { Headers, Header, Rows, Row, Cell } from '../src';

type State = {
  issues: Array<{ key: string, summary: string }>,
  key: number,
};

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

export default class App extends React.Component<{}, State> {
  state = {
    issues: staticData.children,
    key: 1,
  };

  getIssuesData = parent => {
    console.log(parent, ' : parent');
    return parent.children;
  };

  loadMoreIssues = () => {
    let issues = this.state.issues;
    issues = issues.concat({ title: 'hahah', page: '4.1', children: [] });
    this.setState({
      issues,
    });
  };

  render() {
    return (
      <div style={styles}>
        <Button onClick={this.loadMoreIssues}>Load More Issues</Button>
        <Button onClick={this.changeKey}>Change table key</Button>
        <TableTree>
          <Headers>
            <Header>Key</Header>
            <Header>Summary</Header>
          </Headers>
          <Rows
            items={this.state.issues}
            getRowData={this.getIssuesData}
            render={({ title, page, children }) => (
              <Row hasChildren={children.length > 0} itemId={title}>
                <Cell singleLine>{title}</Cell>
                <Cell singleLine>{page}</Cell>
              </Row>
            )}
          />
        </TableTree>
      </div>
    );
  }
}
