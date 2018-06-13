import * as React from 'react';
import styled from 'styled-components';

// Editor for editing story
import FieldRange from '@atlaskit/field-range';
import InlineMessage from '@atlaskit/inline-message';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import 'brace';
import 'brace/mode/json';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';
import AceEditor from 'react-ace';

import { InlineCardView, InlineCardViewProps } from '../src';

const firstHalfText = `
Yeah they wishin' and wishin' and wishin' and wishin'
They wishin' on me, yuh
I been movin' calm, don't start no trouble with me
Tryna keep it peaceful is a struggle for me
Don’t pull up at 6 AM to cuddle with me
You know how I like it when you lovin' on me
I don’t wanna die for them to miss me
Yes I see the things that they wishin' on me
Hope I got some brothers that outlive me
They gon' tell the story, shit was different with me
`;

const secondHalfText = `
God's plan, God's plan
I hold back, sometimes I won't, yuh
I feel good, sometimes I don't, ay, don't
I finessed down Weston Road, ay, 'nessed
Might go down a G.O.D., yeah, wait
I go hard on Southside G, yuh, wait
I make sure that north-side eat
And still
`;

const defaultText = `{
  "link": {
    "href": "https://product-fabric.atlassian.net/browse/MSW-524",
    "title": "Link to ticket"
  },
  "icon": {
    "url":
      "https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg",
    "tooltip": "Issue type"
  },
  "text": "MSW-524: [RFC] Api for inline Link cards UI component",
  "lozenge": {
    "text": "in progress",
    "appearance": "inprogress"
  }
}`;

const getMessageWidth = ({ width }) => width;

const Message = styled.p`
  width: ${getMessageWidth}%;
`;

const defaultJSON = JSON.parse(defaultText);

export interface ExampleProps {}

export interface ExampleState {
  text: string;
  json: InlineCardViewProps;
  error?: string;
  messageWidth: number;
}

class Example extends React.Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    text: defaultText,
    json: defaultJSON,
    messageWidth: 50,
  };

  handleChange = (text: string) => {
    try {
      const json = JSON.parse(text);
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
    const { text, json, error, messageWidth } = this.state;

    return (
      <Page>
        <Grid>
          <GridColumn>
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
              minLines={10}
              tabSize={2}
              enableBasicAutocompletion={true}
              enableLiveAutocompletion={true}
              width="100%"
              height="300px"
            />
            {error && <InlineMessage type="error" title={error} />}
            <br />
            <InlineCardView {...json as any} />
            <br />
            <FieldRange
              label="Message width (px)"
              type="number"
              max={100}
              min={10}
              step={1}
              value={messageWidth}
              onChange={this.handleMessageWidthChange}
            />
            <Message width={messageWidth}>
              {firstHalfText}
              <InlineCardView {...json as any} />
              {secondHalfText}
            </Message>
          </GridColumn>
        </Grid>
      </Page>
    );
  }

  private handleMessageWidthChange = width => {
    this.setState({ messageWidth: Number.parseInt(width) });
  };
}

export default () => <Example />;
