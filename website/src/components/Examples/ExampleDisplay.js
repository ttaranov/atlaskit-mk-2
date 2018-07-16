// @flow
import React, { type ComponentType, type ElementRef, Component } from 'react';
import Loadable from 'react-loadable';
import Loading from '../Loading';
import CodeBlock from '../Code';

type Props = {
  src: string | null,
  name: string,
  src: string,
  example: {
    contents: Function,
    exports: Function,
  },
  displayCode: boolean,
  render: (ComponentType<any>, ComponentType<any>, boolean) => any,
};

export default class ExampleDisplay extends Component<Props> {
  iframeRef: ElementRef<iframe>;
  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src && this.iframeRef) {
      this.iframeRef.contentWindow.unmountApp();
    }
  }
  componentWillUnmount() {
    this.iframeRef.contentWindow.unmountApp();
  }
  getIframeRef = ref => (this.iframeRef = ref);
  render() {
    const ExampleCode = Loadable({
      loader: () => this.props.example.contents(),
      loading: Loading,
      render(loaded) {
        return (
          <CodeBlock grammar="jsx" content={loaded} name={this.props.name} />
        );
      },
    });
    if (!this.props.src) {
      console.error(
        'No source url provided for the examples iframe',
        this.props.src,
      );
      return;
    }
    const Example = () => (
      <iframe
        ref={this.getIframeRef}
        title="example"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        src={this.props.src}
      />
    );

    return this.props.children(ExampleCode, Example, this.props.displayCode);
  }
}
