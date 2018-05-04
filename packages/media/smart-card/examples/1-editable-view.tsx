import * as React from 'react';
import InlineMessage from '@atlaskit/inline-message';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';
import { Provider, CardView } from '../src';
import { convert } from '../src/convert';

const defaultText = `{
  "context": [
    {
      "name": "Trello"
    }
  ],
  "url": "https://trello.com/c/S1O480F0/15-make-json-pretty",
  "name": "Make JSON pretty",
  "summary": "Beautify JSON exports for better usability.",
  "tag": [
    {
      "name": "Low Priority"
    }
  ]
}`;

const defaultJSON = convert(JSON.parse(defaultText));

export interface ExampleProps {}

export interface ExampleState {
  text: string;
  json: Object;
  error?: string;
}

class Example extends React.Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    text: defaultText,
    json: defaultJSON,
  };

  handleChange = (text: string) => {
    try {
      const json = convert(JSON.parse(text));
      this.setState({
        text,
        json,
        error: undefined,
      });
    } catch (err) {
      this.setState({
        text,
        error: err.message,
      });
    }
  };

  render() {
    const { text, json, error } = this.state;
    return (
      <Provider>
        <Page>
          <Grid>
            <GridColumn>
              <CardView {...json as any} />
              <br />
              <br />
              <AceEditor
                focus={true}
                mode="json"
                theme="tomorrow"
                value={text}
                defaultValue={defaultText}
                onChange={this.handleChange}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                  useSoftTabs: true,
                }}
                minLines={20}
                tabSize={2}
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                width="100%"
              />
              {error && <InlineMessage type="error" title={error} />}
            </GridColumn>
          </Grid>
        </Page>
      </Provider>
    );
  }
}

export default () => <Example />;
