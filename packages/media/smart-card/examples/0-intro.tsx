import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Field } from '@atlaskit/form';
import Select from '@atlaskit/select';
import { FieldTextStateless } from '@atlaskit/field-text';
import Button from '@atlaskit/button';
import { Provider, Card } from '../src';
import { CardAppearance } from '../src/Card/CardContent';
import { Checkbox } from '@atlaskit/checkbox';
import { RadioGroup } from '@atlaskit/radio';
import urlsJSON from './example-urls.json';

const params =
  typeof URLSearchParams !== 'undefined'
    ? new URLSearchParams(location.search.slice(1))
    : null;
const param = params ? params.get('url') : null;
const defaultURL = param
  ? param
  : 'https://docs.google.com/document/d/1igbED2X5Qt8rQCeO-5rbDGG6u51wUNumlo2P_EtC9lo/edit';

export interface ExampleState {
  appearance: CardAppearance;
  url: string;
  isSelected: boolean;
}
const ucFirst = (text: string): string =>
  text[0].toUpperCase() + text.substring(1);

class Example extends React.Component<{}, ExampleState> {
  state: ExampleState = {
    appearance: 'block',
    url: defaultURL,
    isSelected: false,
  };

  preventDefaultAndSetUrl(url: string) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      this.setState({ url });
    };
  }

  handleUrlChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({ url: (event.target as HTMLInputElement).value });
  };

  changeUrl = (url: string) => {
    this.setState({ url });
  };

  handleIsSelected = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      isSelected: (event.target as HTMLInputElement).checked,
    });
  };

  handleAppearanceChange = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      appearance: (event.target as HTMLInputElement).value as any,
    });
  };

  renderCard(url: string, isSelected: boolean, appearance: any) {
    if (url) {
      return <Card isSelected={isSelected} appearance={appearance} url={url} />;
    }
    return null;
  }

  render() {
    const { appearance, url, isSelected } = this.state;
    return (
      <Provider>
        <Page>
          {/* <Grid>
            <GridColumn>
              <p>Switch to</p>
              <ul>
                <li>
                  <Button
                    appearance="link"
                    spacing="compact"
                    onClick={this.preventDefaultAndSetUrl(
                      'https://docs.google.com/document/d/1igbED2X5Qt8rQCeO-5rbDGG6u51wUNumlo2P_EtC9lo/edit',
                    )}
                  >
                    Public Google Document
                  </Button>
                </li>
                <li>
                  <Button
                    appearance="link"
                    spacing="compact"
                    onClick={this.preventDefaultAndSetUrl(
                      'https://docs.google.com/spreadsheets/d/168cPaeXw_2zbo6md4pGUdEmXzRsXRQmNP0712ID2TKA/edit?usp=sharing',
                    )}
                  >
                    Public Google Sheet
                  </Button>
                </li>
                <li>
                  <Button
                    appearance="link"
                    spacing="compact"
                    onClick={this.preventDefaultAndSetUrl(
                      'https://docs.google.com/document/d/1nXGwmxJuvQ8CdVQsGnRLOJOo7kJPqesmiBgvcaXD4Aw/edit',
                    )}
                  >
                    Protected Google Document, anyone in org. can view
                  </Button>
                </li>
                <li>
                  <Button
                    appearance="link"
                    spacing="compact"
                    onClick={this.preventDefaultAndSetUrl(
                      'https://docs.google.com/spreadsheets/d/1pHwRAZWA7_aGtlAwOjAOrHGoT5gT0oKS635HTI6gI8I/edit?usp=drive_web&ouid=110769160460483925018',
                    )}
                  >
                    Protected Google Sheet, anyone in org can view
                  </Button>
                </li>
              </ul>
            </GridColumn>
          </Grid> */}
          <Grid>
            <GridColumn medium={8}>
              <Field label="URL">
                <FieldTextStateless
                  autoFocus={true}
                  shouldFitContainer={true}
                  value={url}
                  onChange={this.handleUrlChange}
                />
              </Field>
            </GridColumn>
            <GridColumn medium={2}>
              <Field label="Appearance">
                <RadioGroup
                  options={[
                    { label: 'Block', value: 'block' },
                    { label: 'Inline', value: 'inline' },
                  ]}
                  checkedValue={appearance}
                  label="Pick a "
                  onChange={this.handleAppearanceChange}
                />
                {/* <Select
                  // options={[
                  //   { label: 'Block', value: 'block' },
                  //   { label: 'Inline', value: 'inline' },
                  // ]}
                  value={appearance}
                  onChange={this.handleAppearanceChange}
                /> */}
              </Field>
            </GridColumn>
            <GridColumn medium={2}>
              <Field label="Selection">
                <Checkbox
                  isChecked={isSelected}
                  onChange={this.handleIsSelected}
                  label="is selected"
                  value={true}
                  name="isSelected"
                />
              </Field>
            </GridColumn>
          </Grid>
          {/* <Grid>
            <GridColumn medium="8">
              <FieldTextStateless
                autoFocus={true}
                label="URL"
                shouldFitContainer={true}
                value={url}
                onChange={this.handleUrlChange}
              />
            </GridColumn>
          </Grid> */}
          <Grid>
            <GridColumn>
              <br />
              {this.renderCard(url, isSelected, appearance)}
            </GridColumn>
          </Grid>
          <Grid>
            <GridColumn>
              <br />
              <h3>Example urls:</h3>
              {urlsJSON.map((example: any) => (
                <p>
                  <Button
                    spacing="compact"
                    onClick={() => this.changeUrl(example.url)}
                  >
                    Try it
                  </Button>
                  &nbsp;
                  <a href={example.url}>
                    {example.description ||
                      `${example.provider} ${example.visibility} ${
                        example.type
                      }`}
                  </a>
                </p>
              ))}
            </GridColumn>
          </Grid>
        </Page>
      </Provider>
    );
  }
}

export default () => <Example />;
