import * as React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import * as locales from '../src/i18n';
import languages from '../src/i18n/languages';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  default as FullPageExample,
  SaveAndCancelButtons,
} from './5-full-page';
import LanguagePicker from '../example-helpers/LanguagePicker';

export type Props = {};
export type State = { locale: string };

export default class ExampleEditor extends React.Component<Props, State> {
  state: State = { locale: 'en' };

  render() {
    const { locale } = this.state;
    return (
      <IntlProvider
        locale={this.getLocalTag(locale)}
        messages={locales[locale]}
      >
        {FullPageExample({
          allowHelpDialog: true,
          primaryToolbarComponents: (
            <WithEditorActions
              render={actions => (
                <>
                  <LanguagePicker
                    languages={languages}
                    locale={locale}
                    onChange={this.loadLocale}
                  />
                  <SaveAndCancelButtons editorActions={actions} />
                </>
              )}
            />
          ),
        })}
      </IntlProvider>
    );
  }

  private loadLocale = async (locale: string) => {
    const data = await import(`react-intl/locale-data/${this.getLocalTag(
      locale,
    )}`);
    addLocaleData(data.default);
    this.setState({ locale });
  };

  private getLocalTag = (locale: string) => locale.substring(0, 2);
}
