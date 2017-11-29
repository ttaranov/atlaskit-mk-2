// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import ExampleWrapper from '../example-helpers/ExampleWrapper';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers';
import MentionResource from '../example-helpers/mentions/mention-resource';

const CANCEL_ACTION = () => console.log('Cancel');
const SAVE_ACTION = () => console.log('Save');

const mentionEncoder = (userId: string) => `/secure/ViewProfile?name=${userId}`;

type Props = { handleChange: any };
type State = { input: string; output: string; key: number };
class Demo extends React.Component<Props, State> {
  state = { input: '', output: '', key: 1 };
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
        </fieldset>
        <Editor
          isExpandedByDefault={true}
          onCancel={CANCEL_ACTION}
          onChange={this.props.handleChange}
          onSave={SAVE_ACTION}
          defaultValue={this.state.input}
          key={this.state.key}
          allowLists={true}
          allowLinks={true}
          allowCodeBlock={true}
          allowAdvancedTextFormatting={true}
          allowSubSup={true}
          allowTextColor={true}
          allowBlockQuote={true}
          mediaProvider={storyMediaProviderFactory()}
          mentionProvider={Promise.resolve(new MentionResource())}
          mentionEncoder={mentionEncoder}
        />
      </div>
    );
  }

  private handleImportClick = () =>
    this.setState({
      input: this.refs.input.value,
      key: this.state.key + 1,
    });
}

export default function Component() {
  return (
    <ExampleWrapper
      render={handleChange => <Demo handleChange={handleChange} />}
    />
  );
}
