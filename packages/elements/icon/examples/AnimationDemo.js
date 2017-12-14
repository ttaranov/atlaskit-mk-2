// @flow

import sample from 'lodash.sample';
import React, { Component } from 'react';
import AtlassianIcon from '../glyph/atlassian';
import ArrowUpIcon from '../glyph/arrow-up';
import ArrowDownIcon from '../glyph/arrow-down';
import ArrowLeftIcon from '../glyph/arrow-left';
import ArrowRightIcon from '../glyph/arrow-right';

type State = {
  components: Component<*>[],
};

class AnimationDemo extends Component<{}, State> {
  checkbox: HTMLInputElement;
  timer = 0;

  state = {
    components: [
      ArrowDownIcon,
      ArrowLeftIcon,
      ArrowRightIcon,
      ArrowUpIcon,
      AtlassianIcon,
    ],
  };

  componentDidMount() {
    this.startAnimating();
    this.checkbox.checked = true;
  }

  componentWillUnmount() {
    this.stopAnimating();
  }

  randomIcon = () => {
    const Icon = sample(this.state.components);
    return <Icon label="Random icon" />;
  };

  startAnimating = () => {
    this.timer = setInterval(() => this.forceUpdate(), 300);
  };

  stopAnimating = () => {
    clearInterval(this.timer);
  };

  toggleAnimation = (e: Event) => {
    if (e.target.checked) {
      this.startAnimating();
    } else {
      this.stopAnimating();
    }
  };

  render() {
    return (
      <div>
        <input
          type="checkbox"
          id="animate"
          onChange={this.toggleAnimation}
          ref={elem => {
            this.checkbox = elem;
          }}
        />{' '}
        <label htmlFor="animate">Animate</label>
        <hr />
        <div>
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
          {this.randomIcon()}
        </div>
      </div>
    );
  }
}
AnimationDemo.displayName = 'AnimationDemo';

export default AnimationDemo;
