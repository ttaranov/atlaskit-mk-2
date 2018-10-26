import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import * as React from 'react';
import { components } from 'react-select';

export class ClearIndicator extends React.PureComponent<any> {
  private handleMouseEnter = () => {
    this.props.selectProps.onClearIndicatorHover(true);
  };

  private handleMouseLeave = () => {
    this.props.selectProps.onClearIndicatorHover(false);
  };

  componentWillUnmount() {
    this.handleMouseLeave();
  }

  render() {
    return (
      <div
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <components.ClearIndicator {...this.props}>
          <EditorCloseIcon label="clear" /> {/* TODO i18n */}
        </components.ClearIndicator>
      </div>
    );
  }
}
