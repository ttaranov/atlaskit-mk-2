//@flow
import React, { Component } from 'react';

type i18nShape = {
  prev: string,
  next: string,
};

type Props = {|
  /** The default current page. This makes the current page value uncontrolled. */
  defaultValue: number,
  /** Object that sets the labels for the previous and next buttons. It should
  have the properties 'prev' and 'next', which should be strings. Defaults to
  'Prev' and 'Next' */
  i18n: i18nShape,
  /** Called when the page is changed. Will be called with the number of the new page. */
  onChange: number => void,
  /** The total number of pages in the pagination. */
  total: number,
  /** The current page. This makes the current page value controlled */
  value?: number,
|};

const defaultI18n = {
  prev: 'Prev',
  next: 'Next',
};

/**
 * This component is just a helper to get the props for v7 of Pagination
 * This components is used in docs and is not supposed to anymore of a purpose
 */
export default class v7PropsHelper extends Component<Props> {
  static defaultProps = {
    defaultValue: 1,
    i18n: defaultI18n,
    onChange: () => {},
    total: 0,
  };
  render() {
    //$FlowFixMe
    return <Noop {...this.props} />;
  }
}

//eslint-disable-next-line
function Noop(props: Props) {
  return null;
}
