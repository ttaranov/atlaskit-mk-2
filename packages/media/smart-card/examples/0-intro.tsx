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

  setPredefinedUrl(url: string) {
    return () => {
      this.setState({ url });
    };
  }

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
              <p>Switch to</p>
              <button
                onClick={this.setPredefinedUrl(
                  'https://docs.google.com/document/d/1igbED2X5Qt8rQCeO-5rbDGG6u51wUNumlo2P_EtC9lo/edit',
                )}
              >
                Public Google Document
              </button>
              <button
                onClick={this.setPredefinedUrl(
                  'https://docs.google.com/spreadsheets/d/168cPaeXw_2zbo6md4pGUdEmXzRsXRQmNP0712ID2TKA/edit?usp=sharing',
                )}
              >
                Public Google Sheet
              </button>
              <button
                onClick={this.setPredefinedUrl(
                  'https://docs.google.com/document/d/1nXGwmxJuvQ8CdVQsGnRLOJOo7kJPqesmiBgvcaXD4Aw/edit',
                )}
              >
                Protected Google Document, anyone in org. can view
              </button>
              <button
                onClick={this.setPredefinedUrl(
                  'https://docs.google.com/spreadsheets/d/1pHwRAZWA7_aGtlAwOjAOrHGoT5gT0oKS635HTI6gI8I/edit?usp=drive_web&ouid=110769160460483925018',
                )}
              >
                Protected Google Sheet, anyone in org can view
              </button>
            </GridColumn>
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
