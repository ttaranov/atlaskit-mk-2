import * as React from 'react';
import { style, keyframes } from 'typestyle';
import * as cx from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { colors } from '@atlaskit/theme';

export type Props = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

export type State = {
  flashing: boolean;
};

const containerStyle = style({
  width: '100%',
  height: '100%',
});

const flashTime = 700;

const flashAnimation = keyframes({
  '0%': {
    backgroundColor: 'transparent',
  },
  '20%': {
    backgroundColor: colors.B75,
  },
  '75%': {
    backgroundColor: colors.B75,
  },
  '100%': {
    backgroundColor: 'transparent',
  },
});

const flashStyle = style({
  animation: `${flashAnimation} ${flashTime}ms ease-in-out`,
});

/**
 * Flash animation background component. See Reaction component for usage.
 */
export default class FlashAnimation extends React.PureComponent<Props, State> {
  static defaultProps = {
    className: undefined,
    flash: false,
  };

  animationTimeout: number;

  constructor(props) {
    super(props);

    this.state = {
      flashing: false,
    };
  }

  public flash = () => {
    this.setState(({ flashing }: State) => {
      if (flashing) {
        return null;
      }
      return { flashing: true };
    });
  };

  private resetState = () => {
    this.setState({ flashing: false });
  };

  render() {
    const { className: classNameProp } = this.props;
    const className = cx(containerStyle, classNameProp);
    return (
      <CSSTransition
        classNames={{
          enter: flashStyle,
        }}
        in={this.state.flashing}
        timeout={flashTime}
        onEntered={this.resetState}
      >
        <div className={className}>{this.props.children}</div>
      </CSSTransition>
    );
  }
}
