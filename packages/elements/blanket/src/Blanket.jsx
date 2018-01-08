// @flow
import React, { PureComponent } from 'react';
import Div from './styled';

type Props = {
  /** Whether mouse events can pierce the blanket. If true, onBlanketClicked will not be fired */
  canClickThrough: boolean,
  /** Whether the blanket has a tinted background color. */
  isTinted: boolean,
  /** Handler function to be called when the blanket is clicked */
  onBlanketClicked: () => void,
}

export default class Blanket extends PureComponent {
  props: Props // eslint-disable-line react/sort-comp
  static defaultProps = {
    canClickThrough: false,
    isTinted: false,
    onBlanketClicked: () => {},
  };

  render() {
    const { canClickThrough, isTinted, onBlanketClicked } = this.props;
    const onClick = canClickThrough ? null : onBlanketClicked;
    const containerProps = { canClickThrough, isTinted, onClick };

    return <Div {...containerProps} />;
  }
}
