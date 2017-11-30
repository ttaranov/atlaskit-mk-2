// tslint:disable:no-console
import * as React from 'react';
import { pd } from 'pretty-data';
import Spinner from '@atlaskit/spinner';
import Editor from '../src';

export type Props = {
  render(handleChange: (editor: Editor) => void): React.ReactNode;
};
export type State = {
  html: string;
  story?: any;
  prettify?: boolean;
  isMediaReady?: boolean;
};

export default class Demo extends React.Component<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      html: '',
      prettify: true,
      isMediaReady: true,
    };
  }

  handleChange = (editor: Editor) => {
    this.setState({ isMediaReady: false });

    console.log('Change');

    editor.value.then(value => {
      console.log('Value has been resolved', value);
      this.setState({
        isMediaReady: true,
        html: value || '',
      });
    });
  };

  togglePrettify = () => {
    this.setState({ prettify: !this.state.prettify });
  };

  render() {
    const html = this.state.prettify
      ? pd.xml(this.state.html)
      : this.state.html;

    return (
      <div ref="root">
        {this.props.render(this.handleChange)}
        <fieldset style={{ marginTop: 20 }}>
          <legend>
            HTML (
            <input
              type="checkbox"
              checked={this.state.prettify}
              onChange={this.togglePrettify}
            />
            <span onClick={this.togglePrettify} style={{ cursor: 'pointer' }}>
              {' '}
              prettify
            </span>
            )
          </legend>
          {this.state.isMediaReady ? (
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {html}
            </pre>
          ) : (
            <div style={{ padding: 20 }}>
              <Spinner size="large" />
            </div>
          )}
        </fieldset>
      </div>
    );
  }
}
