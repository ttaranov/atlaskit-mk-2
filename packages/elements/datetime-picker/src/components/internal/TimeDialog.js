// @flow

import React, { Component, type Node } from 'react';
import Droplist from '@atlaskit/droplist';
import TimeDialogItem from './TimeDialogItem';

type Props = {
  value: ?string,
  isOpen: boolean,
  times: Array<string>,
  onUpdate: (value: string) => void,
  children: ?Node,
};

export default class TimeDialog extends Component<Props> {
  container: any;

  static defaultProps = {
    value: null,
    isOpen: false,
    times: [],
    onUpdate() {},
    children: null,
  }

  componentDidUpdate(prevProps: Props) {
    // Scroll to the new value when the value is changed.
    if (this.props.value && this.props.value !== prevProps.value) {
      const index = this.props.times.indexOf(this.props.value);
      if (index === -1) {
        return;
      }

      if (this.container instanceof HTMLDivElement) {
        // Dirty hack copied from @atlaskit/single-select :(
        const scrollable = this.container.querySelector('[data-role="droplistContent"]');
        let item;

        if (scrollable && index !== undefined) {
          item = scrollable.querySelectorAll('[data-role="droplistItem"]')[index];
        }

        if (item && scrollable) {
          scrollable.scrollTop = (item.offsetTop - scrollable.clientHeight) + item.clientHeight;
        }
      }
    }
  }

  renderItems = () => this.props.times.map(value => (
    <TimeDialogItem
      key={value}
      value={value}
      onSelect={this.props.onUpdate}
      isFocused={this.props.value === value}
    />
  ));

  render() {
    return (
      <div ref={ref => { this.container = ref; }}>
        <Droplist
          isKeyboardInteractionDisabled
          isOpen={this.props.isOpen}
          trigger={this.props.children}
        >
          {this.renderItems()}
        </Droplist>
      </div>
    );
  }
}
