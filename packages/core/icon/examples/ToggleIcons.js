// @flow
import React, { Component } from 'react';
import { colors } from '@atlaskit/theme';
import CheckboxIcon from '../glyph/checkbox';
import RadioIcon from '../glyph/radio';

const toggleableIcons = [['checkbox', CheckboxIcon], ['radio', RadioIcon]];

const styles = {
  iconChecked: {
    color: colors.N400,
    fill: colors.N0,
  },
  iconUnchecked: {
    color: colors.N400,
    fill: colors.N400,
  },
  iconReverse: {
    color: colors.B50,
    fill: colors.N700,
  },
};

type State = {
  toggleColor: boolean,
  toggleFill: boolean,
  icons: any,
};

export default class ToggleIcons extends Component<{}, State> {
  state = {
    toggleColor: false,
    toggleFill: false,
    icons: toggleableIcons,
  };

  render() {
    const colorStyle = this.state.toggleColor
      ? styles.iconChecked
      : styles.iconUnchecked;
    const colorStyleReverse = this.state.toggleFill
      ? styles.iconReverse
      : styles.iconChecked;
    return (
      <div>
        <h6 style={{ padding: 0, margin: '10px 5px' }}>
          Click on these icons to see them &#39;check&#39; and &#39;uncheck&#39;
          itselves
        </h6>

        <div style={colorStyle}>
          {this.state.icons.map(([id, Icon]) => (
            <Icon
              key={id}
              label="Icon which checks and unchecks itself"
              secondaryColor="inherit"
              onClick={() =>
                this.setState({ toggleColor: !this.state.toggleColor })
              }
            />
          ))}
        </div>
        <h6 style={{ padding: 0, margin: '10px 5px' }}>
          Click on these icons to see them &#39;reverse&#39; itself while
          staying &#39;checked&#39;
        </h6>
        <div style={colorStyleReverse}>
          {this.state.icons.map(([id, Icon]) => (
            <Icon
              key={id}
              secondaryColor="inherit"
              label="Icon which reverses itself while staying checked"
              onClick={() =>
                this.setState({ toggleFill: !this.state.toggleFill })
              }
            />
          ))}
        </div>
      </div>
    );
  }
}
