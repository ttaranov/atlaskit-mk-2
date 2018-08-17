import { IntlProvider, intlShape } from 'react-intl';
import { messages } from '@atlaskit/editor-common';
import { mount, ReactWrapper } from 'enzyme';

const mountWithIntlContext = (component): ReactWrapper => {
  const intlProvider = new IntlProvider({
    locale: 'en',
    messages: messages,
  });
  const intl = intlProvider.getChildContext().intl;

  return mount(component, {
    context: { intl },
    childContextTypes: { intl: intlShape },
  });
};

export default mountWithIntlContext;
