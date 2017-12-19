// @flow
import React, { Component } from 'react';

export default class FilledIconExample extends Component {
  state = {
    color: '#000000',
    fill: '#ff0000',
  };

  render() {
    const iconStyles = {
      color: this.state.color,
      fill: this.state.fill,
    };

    return (
      <form>
        <div className="ak-field-group">
          <label htmlFor="color">Icon primary colour</label>
          <input
            type="color"
            className="ak-field-color"
            id="color"
            ref={input => {
              this.ColorInput = input;
            }}
            defaultValue={this.state.color}
            onChange={() => this.setState({ color: this.ColorInput.value })}
            name="color"
          />
        </div>
        <div className="ak-field-group">
          <label htmlFor="fill">Icon secondary colour</label>
          <input
            type="color"
            className="ak-field-color"
            id="fill"
            ref={input => {
              this.FillInput = input;
            }}
            defaultValue={this.state.fill}
            onChange={() => this.setState({ fill: this.FillInput.value })}
            name="fill"
          />
        </div>
        <p>
          <svg
            focusable="false"
            className="ak-icon ak-icon__size-xlarge"
            style={iconStyles}
            aria-label="Text colour"
          >
            <use xlinkHref="#ak-icon-editor/text-color" />
          </svg>
        </p>
      </form>
    );
  }
}
