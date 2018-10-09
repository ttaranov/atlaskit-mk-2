import * as React from 'react';
import { IntlProvider, addLocaleData } from 'react-intl';
import enMessages from '../src/i18n/en';
import languages from '../src/i18n/languages';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  default as FullPageExample,
  SaveAndCancelButtons,
} from './5-full-page';
import LanguagePicker from '../example-helpers/LanguagePicker';

export type Props = {};
export type State = { locale: string; messages: { [key: string]: string } };

export default class ExampleEditor extends React.Component<Props, State> {
  state: State = { locale: 'en', messages: enMessages };

  render() {
    const { locale, messages } = this.state;
    return (
      <IntlProvider locale={this.getLocalTag(locale)} messages={messages}>
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
    const localeData = await import(`react-intl/locale-data/${this.getLocalTag(
      locale,
    )}`);
    addLocaleData(localeData.default);
    const messages = await import(`../src/i18n/${locale}`);
    this.setState({ locale, messages: messages.default });
  };

  private getLocalTag = (locale: string) => locale.substring(0, 2);
}
