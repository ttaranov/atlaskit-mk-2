// tslint:disable:no-console
import * as React from 'react';
import { default as Editor } from '../src';
import BitbucketStyles from '../example-helpers/bitbucketStyles';

const CANCEL_ACTION = () => console.log('Cancel');
const CHANGE_ACTION = () => console.log('Change');
const SAVE_ACTION = () => console.log('Save');

export default class EditorWithFeedback extends React.Component<{}, { hasJquery?: boolean }> {
  state = {
    hasJquery: false,
  };

  componentDidMount() {
    delete window.jQuery;
    this.loadJquery();
  }

  render() {
    if (!this.state.hasJquery) {
      return <h3>Please wait, loading jQuery ...</h3>;
    }

    return (
      <BitbucketStyles>
        <Editor onCancel={CANCEL_ACTION} onChange={CHANGE_ACTION} onSave={SAVE_ACTION} />
      </BitbucketStyles>
    );
  }

  private loadJquery = () => {
    const scriptElem = document.createElement('script');
    scriptElem.type = 'text/javascript';
    scriptElem.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js';

    scriptElem.onload = () => {
      this.setState({
        ...this.state,
        hasJquery: true,
      });
    };

    document.body.appendChild(scriptElem);
  };
}
