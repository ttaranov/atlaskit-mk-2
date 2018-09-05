import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';
import { FieldTextStateless } from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import { Provider, Card } from '../src';
import { CardAppearance } from '../src/Card/CardContent';
// import '../mocks';

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
  isSelected: boolean;
}

class Example extends React.Component<ExampleProps, ExampleState> {
  state: ExampleState = {
    appearance: { label: 'Block', value: 'block' },
    url: defaultURL,
    isSelected: false,
  };

  setPredefinedUrl(url: string) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      this.setState({ url });
    };
  }

  handleUrlChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ url: (event.target as HTMLInputElement).value });
  };

  handleIsSelected = () => {
    this.setState({
      isSelected: !this.state.isSelected,
    });
  };

  handleAppearanceChange = (option: AppearanceOption) => {
    this.setState({
      appearance: option,
    });
  };

  render() {
    const { appearance, url, isSelected } = this.state;
    return (
      <Provider>
        <Page>
          <Grid>
            <GridColumn>
              <p>Switch to</p>
              <Button
                onClick={this.setPredefinedUrl(
                  'https://docs.google.com/document/d/1igbED2X5Qt8rQCeO-5rbDGG6u51wUNumlo2P_EtC9lo/edit',
                )}
              >
                Public Google Document
              </Button>
              <Button
                onClick={this.setPredefinedUrl(
                  'https://docs.google.com/spreadsheets/d/168cPaeXw_2zbo6md4pGUdEmXzRsXRQmNP0712ID2TKA/edit?usp=sharing',
                )}
              >
                Public Google Sheet
              </Button>
              <Button
                onClick={this.setPredefinedUrl(
                  'https://docs.google.com/document/d/1nXGwmxJuvQ8CdVQsGnRLOJOo7kJPqesmiBgvcaXD4Aw/edit',
                )}
              >
                Protected Google Document, anyone in org. can view
              </Button>
              <Button
                onClick={this.setPredefinedUrl(
                  'https://docs.google.com/spreadsheets/d/1pHwRAZWA7_aGtlAwOjAOrHGoT5gT0oKS635HTI6gI8I/edit?usp=drive_web&ouid=110769160460483925018',
                )}
              >
                Protected Google Sheet, anyone in org can view
              </Button>
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
              <br />
              <Button
                label="Is selected?"
                onClick={this.handleIsSelected}
              >{ this.state.isSelected ? "Deselect the card" : "Make the card selected" }</Button>
              <br />
              <FieldTextStateless
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
              <Card
                isSelected={isSelected}
                appearance={appearance.value}
                url={url}
              />
            </GridColumn>
          </Grid>
        </Page>
      </Provider>
    );
  }
}

export default () => <Example />;
