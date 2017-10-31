// tslint:disable:no-console

import * as React from 'react';
import { pd } from 'pretty-data';
import Spinner from '@atlaskit/spinner';
import Editor from '../src';
import CqStyles from './CqStyles';

type Props = { render(handleChange: (editor: Editor) => void): React.ReactInstance };
type State = { cxhtml?: string; story?: any; prettify?: boolean; isMediaReady?: boolean };

export default class Demo extends React.Component<Props, State> {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      cxhtml: '',
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
        cxhtml: value,
      });
    });
  };

  togglePrettify = () => {
    this.setState({ prettify: !this.state.prettify });
  };

  render() {
    const xml = this.state.prettify ? pd.xml(this.state.cxhtml || '') : this.state.cxhtml || '';

    return (
      <CqStyles>
        <div ref="root">
          {this.props.render(this.handleChange)}
          <fieldset style={{ marginTop: 20 }}>
            <legend>
              CXHTML output (
              <input type="checkbox" checked={this.state.prettify} onChange={this.togglePrettify} />
              <span onClick={this.togglePrettify} style={{ cursor: 'pointer' }}>
                {' '}
                prettify
              </span>
              )
            </legend>
            {this.state.isMediaReady ? (
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{xml}</pre>
            ) : (
              <div style={{ padding: 20 }}>
                <Spinner size="large" />
              </div>
            )}
          </fieldset>
        </div>
      </CqStyles>
    );
  }
}
