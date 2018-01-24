import styled from 'styled-components';
import * as React from 'react';
import { Component } from 'react';
import { pd } from 'pretty-data';
import Button, { ButtonGroup } from '@atlaskit/button';
import { akColorN80 } from '@atlaskit/util-shared-styles';
import {
  Editor,
  EditorContext,
  WithEditorActions,
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '@atlaskit/editor-core';
import { ConfluenceTransformer } from '../src';
import {
  storyContextIdentifierProviderFactory,
  macroProvider,
} from '@atlaskit/editor-test-helpers';
import Spinner from '@atlaskit/spinner';
import { akBorderRadius } from '@atlaskit/util-shared-styles';

// tslint:disable-next-line:variable-name
export const TitleInput = styled.input`
  border: none;
  outline: none;
  font-size: 2.07142857em;
  margin: 0 0 21px;
  padding: 0;

  &::placeholder {
    color: ${akColorN80};
  }
`;
TitleInput.displayName = 'TitleInput';

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  padding: 0 20px;
  height: 100%;
  background: #fff;
  box-sizing: border-box;

  & .ProseMirror {
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${akBorderRadius};
    }
  }
}`;
Content.displayName = 'Content';

// tslint:disable-next-line:no-console
const analyticsHandler = (actionName, props) => console.log(actionName, props);

// tslint:disable-next-line:variable-name
const SaveAndCancelButtons = props => (
  <ButtonGroup>
    <Button
      appearance="primary"
      onClick={() =>
        props.editorActions
          .getValue()
          // tslint:disable-next-line:no-console
          .then(value => console.log(value.toJSON()))
      }
    >
      Publish
    </Button>
    <Button
      appearance="subtle"
      // tslint:disable-next-line:jsx-no-lambda
      onClick={() => props.editorActions.clear()}
    >
      Close
    </Button>
  </ButtonGroup>
);

const providers = {
  macroProvider: Promise.resolve(macroProvider),
  contextIdentifierProvider: storyContextIdentifierProviderFactory(),
};

type ExampleProps = {
  onChange: Function;
};

type ExampleState = {
  input: string;
  output: string;
};

class Example extends Component<ExampleProps, ExampleState> {
  state = {
    input: '',
    output: '',
  };

  refs: {
    input: HTMLTextAreaElement;
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextState.input !== this.state.input ||
      nextState.output !== this.state.output
    );
  }

  render() {
    return (
      <div ref="root">
        <Content>
          <EditorContext>
            <WithEditorActions
              // tslint:disable-next-line:jsx-no-lambda
              render={actions => (
                <Editor
                  appearance="full-page"
                  analyticsHandler={analyticsHandler}
                  allowTextFormatting={true}
                  allowHyperlinks={true}
                  allowUnsupportedContent={true}
                  allowExtension={true}
                  {...providers}
                  placeholder="Write something..."
                  shouldFocus={false}
                  onChange={editorView => this.props.onChange(actions)}
                  defaultValue={this.state.input}
                  contentTransformerProvider={schema =>
                    new ConfluenceTransformer(schema)
                  }
                  key={this.state.input}
                  contentComponents={
                    <TitleInput
                      placeholder="Give this page a title..."
                      // tslint:disable-next-line:jsx-no-lambda
                      innerRef={ref => ref && ref.focus()}
                    />
                  }
                  primaryToolbarComponents={
                    <WithEditorActions
                      // tslint:disable-next-line:jsx-no-lambda
                      render={actions => (
                        <SaveAndCancelButtons editorActions={actions} />
                      )}
                    />
                  }
                />
              )}
            />
          </EditorContext>
        </Content>
        <p>Try it yourself, paste one of the following links:</p>
        <ul>
          <li>www.trello.com?board=CFE</li>
          <li>www.trello.com</li>
          <li>www.twitter.com</li>
        </ul>
      </div>
    );
  }
}

export type ExampleWrapperProps = {};
export type ExampleWrapperState = {
  cxhtml?: string;
  story?: any;
  prettify?: boolean;
  isMediaReady?: boolean;
};

export default class ExampleWrapper extends Component<
  ExampleWrapperProps,
  ExampleWrapperState
> {
  state: ExampleWrapperState = {
    cxhtml: '',
    prettify: true,
    isMediaReady: true,
  };

  handleChange = editorActions => {
    this.setState({ isMediaReady: false });

    // tslint:disable-next-line:no-console
    console.log('Change');

    editorActions.getValue().then(value => {
      // tslint:disable-next-line:no-console
      console.log('Value has been resolved', value);
      this.setState({
        isMediaReady: true,
        cxhtml: value,
      });
    });
  };

  togglePrettify = () => {
    this.setState({ prettify: !this.state.prettify });
  };

  render() {
    const xml = this.state.prettify
      ? pd.xml(this.state.cxhtml || '')
      : this.state.cxhtml || '';

    return (
      <div ref="root">
        <Example onChange={this.handleChange} />

        <fieldset style={{ marginTop: 20 }}>
          <legend>
            CXHTML output (
            <input
              type="checkbox"
              checked={this.state.prettify}
              onChange={this.togglePrettify}
            />
            <span onClick={this.togglePrettify} style={{ cursor: 'pointer' }}>
              {' '}
              prettify
            </span>
            )
          </legend>
          {this.state.isMediaReady ? (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {xml}
            </pre>
          ) : (
            <div style={{ padding: 20 }}>
              <Spinner size="large" />
            </div>
          )}
        </fieldset>
      </div>
    );
  }
}
