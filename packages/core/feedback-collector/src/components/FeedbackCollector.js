// @flow
import React from 'react';
// import type { Element } from 'react';

type Props = {
  /** Description */
  myProp: string,
};

export default class FeedbackCollector extends React.Component<Props> {
  static defaultProps: $Shape<Props> = {
    myProp: '',
  };

  render() {
    return <div myProp="Hello" />;
  }
}
