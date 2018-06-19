import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import TextField from '@atlaskit/field-text';
import { Provider, Card } from '../src';
import '../mocks';
import { CardAppearance } from '../src/Card';

const params =
  typeof URLSearchParams !== 'undefined'
    ? new URLSearchParams(location.search.slice(1))
    : null;
const param = params ? params.get('url') : null;
const defaultURL = param
  ? param
  : 'https://drive.google.com/open?id=0B1I77F_P5VV2c3RhcnRlcl9maWxlX2Rhc2hlclYw';

export interface ExampleProps {}

export interface ExampleState {
  appearance: CardAppearance;
  url: string;
}

class Example extends React.Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    appearance: 'block',
    url: defaultURL,
  };

  handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ url: event.target.value });
  };

  handleAppearanceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      appearance: event.currentTarget.value === 'block' ? 'block' : 'inline',
    });
  };

  render() {
    const { appearance, url } = this.state;
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
              <select value={appearance} onChange={this.handleAppearanceChange}>
                <option>block</option>
                <option>inline</option>
              </select>
              <br />
              <small>
                Try entering <code>public-happy</code>,{' '}
                <code>private-happy</code>, <code>private-forbidden</code>,{' '}
                <code>not-found</code> or <code>error</code> as the URL
              </small>
            </GridColumn>
          </Grid>
          <Grid>
            <GridColumn>
              <br />
              <Card appearance={appearance} url={url} />
            </GridColumn>
          </Grid>
        </Page>
      </Provider>
    );
  }
}

export default () => <Example />;
