import * as React from 'react';
import { IntlProvider, intlShape } from 'react-intl';

export interface Props {
  messages?: Object;
}

export default class IntlMessageProvider extends React.Component<Props, any> {
  static contextTypes = {
    intl: intlShape,
  };

  static childContextTypes = {
    intl: intlShape,
  };

  private intl: Object;

  constructor(props, context) {
    super(props, context);
    const locale = context.intl ? context.intl.locale : 'en';
    const intlProvider = new IntlProvider({
      locale,
      messages: props.messages[locale] || props.messages['en'],
    });
    this.intl = intlProvider.getChildContext().intl;
  }

  getChildContext() {
    return {
      intl: this.intl,
    };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
