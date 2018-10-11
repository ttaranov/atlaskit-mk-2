// @flow
import React, { Component } from 'react';
import FieldRange from '@atlaskit/field-range';
import SectionMessage from '../src';

class Example extends Component<*, *> {
  state = { width: 800 };

  updateWidth = (width: number) => {
    this.setState({ width });
  };

  render() {
    const { width } = this.state;

    return (
      <div>
        <p>SectionMessage expands to fill the space available to it.</p>
        <FieldRange
          min={100}
          max={800}
          onChange={this.updateWidth}
          step={1}
          value={this.state.width}
        />
        <div style={{ maxWidth: `${width}px` }}>
          <SectionMessage
            title="Some eye-catching info before you continue"
            actions={[
              {
                href: 'https://en.wikipedia.org/wiki/Mary_Shelley',
                text: 'This may help',
              },
              {
                href: 'https://en.wikipedia.org/wiki/Villa_Diodati',
                text: 'A second exit point',
              },
            ]}
          >
            <p>
              We wanted to ensure that you read this information, so we have put
              it into a section message. Once you have read it, there are a few
              actions you may want to take, otherwise you can continue on the
              flow of the application.
            </p>
          </SectionMessage>
        </div>
      </div>
    );
  }
}

export default Example;
