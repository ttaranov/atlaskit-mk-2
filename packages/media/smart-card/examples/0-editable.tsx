import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import TextField from '@atlaskit/field-text';
import { Provider, Card } from '../src';

export interface ExampleProps {}

export interface ExampleState {
  url: string;
}

class Example extends React.Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    url:
      'https://trello.com/c/CbrzZIQ2/45-1878-piedmont-ave-former-bank-now-inkaholiks-pringle-and-smith',
  };

  handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ url: event.target.value });
  };

  render() {
    const { url } = this.state;
    return (
      <Provider>
        <Page>
          <Grid>
            <GridColumn>
              <TextField
                autoFocus={true}
                label="URL"
                shouldFitContainer={true}
                value={url}
                onChange={this.handleUrlChange}
              />
            </GridColumn>
          </Grid>
          <Grid>
            <GridColumn>
              <br />
              <Card url={url} />
            </GridColumn>
          </Grid>
        </Page>
      </Provider>
    );
  }
}

export default () => <Example />;
