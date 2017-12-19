// tslint:disable:no-console
import * as React from 'react';
import styled from 'styled-components';
import { Editor, EditorContext, WithEditorActions } from '@atlaskit/editor-core';
import { BitbucketTransformer } from '../src';
import exampleBitbucketHTML from '../example-helpers/exampleHTML';

const Container = styled.div`
  display: grid;
  grid-template-columns: 33% 33% 33%;
  #source,#output {
    border: 2px solid;
    margin: 8px;
    padding: 8px;
    white-space: pre-wrap;
    &:focus {
      outline: none;
    }
    &:empty:not(:focus):before {
      content: attr(data-placeholder)
      font-size: 14px;
    }
  }
  #source {
    font-size: xx-small;
  }
`;

export type Props = { actions: any };
export type State = { source: string, output: string };
class TransformerPanels extends React.PureComponent<Props, State> {
  state: State = { source: exampleBitbucketHTML, output: '' };

  componentDidMount() {
    setTimeout(() => {
      this.props.actions.replaceDocument(this.state.source);
    });
  }

  handleUpdateToSource = (e: React.FormEvent<HTMLDivElement>) => {
    const value = e.currentTarget.innerText;
    this.setState({ source: value}, () => this.props.actions.replaceDocument(value));
  }

  handleChangeInTheEditor = () => {
    this.props.actions.getValue().then(value => {
      this.setState({ output: value });
    });
  }

  render() {
    return (
      <Container>
        <div
          id="source"
          contentEditable
          data-placeholder="Enter HTML to convert"
          onInput={this.handleUpdateToSource}
        >{exampleBitbucketHTML}</div>
        <div id="editor">
          <Editor
            appearance="comment"
            allowTextFormatting={true}
            allowTasksAndDecisions={true}
            allowHyperlinks={true}
            allowCodeBlocks={true}
            allowLists={true}
            allowRule={true}
            allowTables={true}
            contentTransformerProvider={schema => new BitbucketTransformer(schema)}
            onChange={this.handleChangeInTheEditor}
          />
        </div>
        <div
          id="output"
          data-placeholder="This is an empty document (or something has gone really wrong)"
        >{this.state.output}</div>
      </Container>
    )
  }
}

export default () => (
  <EditorContext>
    <WithEditorActions render={actions => <TransformerPanels actions={actions} />} />
  </EditorContext>
)