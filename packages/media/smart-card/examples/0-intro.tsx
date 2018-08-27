import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';
import TextField from '@atlaskit/field-text';
import { Provider, Card } from '../src';
import { CardAppearance } from '../src/Card/CardContent';
import '../mocks';

const params =
  typeof URLSearchParams !== 'undefined'
    ? new URLSearchParams(location.search.slice(1))
    : null;
const param = params ? params.get('url') : null;
const defaultURL = param
  ? param
  : 'https://drive.google.com/open?id=0B1I77F_P5VV2c3RhcnRlcl9maWxlX2Rhc2hlclYw';

export interface ExampleProps {}

export type AppearanceOption = {
  label: string;
  value: CardAppearance;
};

export interface ExampleState {
  appearance: AppearanceOption;
  url: string;
}

class Example extends React.Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    appearance: { label: 'Block', value: 'block' },
    url: defaultURL,
  };

  handleUrlChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ url: (event.target as HTMLInputElement).value });
  };

  handleAppearanceChange = (option: AppearanceOption) => {
    this.setState({
      appearance: option,
    });
  };

  render() {
    const { appearance, url } = this.state;
    return (
      <Provider>
        <Page>
          <Grid>
            <GridColumn>
              <Field label="Appearance">
                <Select
                  options={[
                    { label: 'Block', value: 'block' },
                    { label: 'Inline', value: 'inline' },
                  ]}
                  value={appearance}
                  onChange={this.handleAppearanceChange}
                />
              </Field>
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
              <Card appearance={appearance.value} url={url} />
            </GridColumn>
          </Grid>
        </Page>
      </Provider>
    );
  }
}

export default () => <Example />;
