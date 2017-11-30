// tslint:disable:no-console

import * as React from 'react';
import Editor from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';
import { resourceProvider } from '../example-helpers/mentions/story-data';

const mentionProvider = new Promise<any>(resolve => {
  resolve(resourceProvider);
});

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

const CODE_MACRO = `<ac:structured-macro ac:name="code" ac:schema-version="1" ac:macro-id="1c61c2dd-3574-45f3-ac07-76d400504d84"><ac:parameter ac:name="language">js</ac:parameter><ac:parameter ac:name="theme">Confluence</ac:parameter><ac:parameter ac:name="title">Example</ac:parameter><ac:plain-text-body><![CDATA[if (true) {
  console.log('Hello World');
}]]></ac:plain-text-body></ac:structured-macro>`;

const PANEL_MACRO = `<ac:structured-macro ac:name="warning" ac:schema-version="1" ac:macro-id="f348e247-44a6-41e5-8034-e8aa469649b5"><ac:parameter ac:name="title">Hello</ac:parameter><ac:rich-text-body><p>Warning panel</p></ac:rich-text-body></ac:structured-macro>`;
const JIRA_ISSUE =
  '<p><ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="a1a887df-a2dd-492b-8b5c-415d8eab22cf"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter><ac:parameter ac:name="key">ED-1068</ac:parameter></ac:structured-macro></p>';
const JIRA_ISSUES_LIST =
  '<p><ac:structured-macro ac:name="jira" ac:schema-version="1" ac:macro-id="be852c2a-4d33-4ceb-8e21-b3b45791d92e"><ac:parameter ac:name="server">JIRA (product-fabric.atlassian.net)</ac:parameter><ac:parameter ac:name="columns">key,summary,type,created,updated,due,assignee,reporter,priority,status,resolution</ac:parameter><ac:parameter ac:name="maximumIssues">20</ac:parameter><ac:parameter ac:name="jqlQuery">project = ED AND component = codeblock</ac:parameter><ac:parameter ac:name="serverId">70d83bc8-0aff-3fa5-8121-5ae90121f5fc</ac:parameter></ac:structured-macro></p>';

type Props = { handleChange: any };
type State = { input: string; output: string };

class Demo extends React.Component<Props, State> {
  state = { input: '', output: '' };
  refs: {
    input: HTMLTextAreaElement;
  };

  render() {
    return (
      <div ref="root">
        <fieldset style={{ marginTop: 20, marginBottom: 20 }}>
          <legend>Input</legend>
          <textarea
            style={{
              boxSizing: 'border-box',
              border: '1px solid lightgray',
              fontFamily: 'monospace',
              padding: 10,
              width: '100%',
              height: 100,
            }}
            ref="input"
          />
          <button onClick={this.handleImportClick}>Import</button>
          <button onClick={this.handleInsertCodeClick}>Insert Code</button>
          <button onClick={this.handleInsertPanelClick}>Insert Panel</button>
          <button onClick={this.handleInsertJiraIssueClick}>
            Insert JIRA Issue
          </button>
          <button onClick={this.handleInsertJiraIssuesListClick}>
            Insert JIRA Issues List
          </button>
        </fieldset>
        <Editor
          isExpandedByDefault={true}
          onCancel={CANCEL_ACTION}
          onChange={this.props.handleChange}
          onSave={SAVE_ACTION}
          defaultValue={this.state.input}
          key={this.state.input}
          mentionProvider={mentionProvider}
          analyticsHandler={console.log.bind(console, 'Analytics event')}
        />
      </div>
    );
  }

  private handleImportClick = () =>
    this.setState({ input: this.refs.input.value });
  private handleInsertCodeClick = () => this.setState({ input: CODE_MACRO });
  private handleInsertPanelClick = () => this.setState({ input: PANEL_MACRO });
  private handleInsertJiraIssueClick = () =>
    this.setState({ input: JIRA_ISSUE });
  private handleInsertJiraIssuesListClick = () =>
    this.setState({ input: JIRA_ISSUES_LIST });
}

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => <Demo handleChange={handleChange} />}
    />
  );
}
