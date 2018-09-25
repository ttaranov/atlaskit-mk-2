/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */
import * as React from 'react';
import { ReactElement } from 'react';
import { IntlProvider, InjectedIntlProps, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl<P>(
  node: ReactElement<P>,
  { context = {}, ...additionalOptions } = {},
) {
  if (typeof node.type !== 'string' && node.type.name === 'InjectIntl') {
    const unwrappedType = (node.type as any).WrappedComponent;
    (node as any) = React.createElement(unwrappedType, node.props);
  }
  return shallow(
    nodeWithIntlProp(node) as ReactElement<P & InjectedIntlProps>,
    {
      context: { ...context, intl },
      ...additionalOptions,
    },
  );
}

export function mountWithIntl<P>(
  node: ReactElement<P>,
  { context = {}, childContextTypes = {}, ...additionalOptions } = {},
) {
  if (typeof node.type !== 'string' && node.type.name === 'InjectIntl') {
    const unwrappedType = (node.type as any).WrappedComponent;
    (node as any) = React.createElement(unwrappedType, node.props);
  }
  return mount(nodeWithIntlProp(node) as ReactElement<P & InjectedIntlProps>, {
    context: { ...context, intl },
    childContextTypes: { ...childContextTypes, intl: intlShape },
    ...additionalOptions,
  });
}
