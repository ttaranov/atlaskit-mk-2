// @flow
import React from 'react';
import Button from '@atlaskit/button';
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
    issues: [
      { key: 'key1', summary: 'Test Summary1' },
      { key: 'key2', summary: 'Test Summary2' },
      { key: 'key3', summary: 'Test Summary3' },
      { key: 'key4', summary: 'Test Summary4' },
      { key: 'key5', summary: 'Test Summary5' },
    ],
    key: 1,
  };

  getIssuesData = () => {
    console.log(
      `GetIssuesData Called return #${this.state.issues.length} issues`,
    );
    return this.state.issues;
  };

  loadMoreIssues = () => {
    const id = this.state.issues.length + 1;
    const newIssues = this.state.issues.concat([
      { key: `key${id}`, summary: `Test Summary${id}` },
    ]);
    console.log(`Table now has ${newIssues.length} issues`);
    this.setState({ issues: newIssues });
  };

  changeKey = () => {
    this.setState({ key: this.state.key + 1 });
  };

  render() {
    console.log(this.state.issues);
    return (
      <div style={styles}>
        <h1>Hello Atlassian</h1>
        <h2>Click the button to add more issues to the table</h2>
        <Button onClick={this.loadMoreIssues}>Load More Issues</Button>
        <Button onClick={this.changeKey}>Change table key</Button>
        <TableTree key={this.state.key}>
          <Headers>
            <Header>Key</Header>
            <Header>Summary</Header>
          </Headers>
          <Rows
            items={this.getIssuesData}
            render={({ key, summary }) => (
              <Row itemId={key} hasChildren={false}>
                <Cell singleLine>{key}</Cell>
                <Cell singleLine>{summary}</Cell>
              </Row>
            )}
          />
        </TableTree>
      </div>
    );
  }
}
