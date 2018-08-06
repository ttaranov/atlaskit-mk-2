import * as React from 'react';
import RendererDemo from './helper/RendererDemo';

export default class Example extends React.Component {
  state = {
    inlineComments: `
    [
      {
        from: 2,
        to: 5,
        conversationId: "123813458123495",
        resolved: false
      }
    ]
    `,
  };
  onInlineCommentChange() {}
  render() {
    return (
      <div>
        <textarea
          style={{
            boxSizing: 'border-box',
            border: '1px solid lightgray',
            fontFamily: 'monospace',
            fontSize: 16,
            padding: 10,
            width: '100%',
            height: 320,
          }}
          ref="input"
          onChange={this.onInlineCommentChange}
          value={this.state.inlineComments}
        />
        <RendererDemo
          withProviders={true}
          withPortal={true}
          serializer="react"
        />
      </div>
    );
  }
}

// export default function Example() {

// }
