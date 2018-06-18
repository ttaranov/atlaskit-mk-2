import * as React from 'react';
import InlineMessage from '@atlaskit/inline-message';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';
import { Provider } from '../src';
import { extractBlockPropsFromJSONLD } from '../src/extractBlockPropsFromJSONLD';
import { BlockCard } from '@atlaskit/media-ui';

const defaultText = `{
  "@type": "Document",
  "generator": {
    "@type": "Application",
    "name": "Confluence"
  },
  "url": "https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424",
  "name": "Founder Update 76: Hello, Trello!",
  "summary": "Today is a big day for Atlassian – we have entered into an agreement to buy Trello. (boom)"
}`;

const defaultJSON = extractBlockPropsFromJSONLD(JSON.parse(defaultText));

export interface ExampleProps {}

export interface ExampleState {
  text: string;
  props: BlockCard.ResolvedViewProps;
  error?: string;
}

class Example extends React.Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    text: defaultText,
    props: defaultJSON,
  };

  handleChange = (text: string) => {
    try {
      const props = extractBlockPropsFromJSONLD(JSON.parse(text));
      this.setState({
        text,
        props,
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
    const { text, props, error } = this.state;
    return (
      <Provider>
        <Page>
          <Grid>
            <GridColumn>
              <BlockCard.ResolvedView {...props as any} />
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
