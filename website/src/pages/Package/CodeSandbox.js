import React, { Component } from 'react';
import CSB2Transformer from '../../utils/CSBTransformer';
import Button from '@atlaskit/button';
const codesandboxURL = 'https://codesandbox.io/api/v1/sandboxes/define';

function maskRelativeImport(exampleCode, pkgJSON, relImport, source) {
  if (source === '../src') {
    const { name, version } = pkgJSON;
    const newImport = relImport.replace(source, name);
    return exampleCode.replace(relImport, newImport);
  } else {
    console.error('Unable to resolve relative path', relImport);
    return exampleCode;
  }
}

export default class CSB extends Component<{}, {}> {
  state = { parameters: '' };
  deployToCSB = () => {
    const { pkgJSON, example } = this.props;

    Promise.all([example.contents(), pkgJSON.exports()])
      .then(([exampleData, pkgJSONDATA]) =>
        CSB2Transformer(exampleData, pkgJSONDATA, maskRelativeImport),
      )
      .then(({ data, params }) => {
        this.setState({ parameters: params });
      })
      .then(() => this.form.submit())
      .catch(e => console.error(e));
  };

  render() {
    return (
      <span>
        <form
          action="https://codesandbox.io/api/v1/sandboxes/define"
          method="POST"
          target="_blank"
          ref={r => {
            this.form = r;
          }}
        >
          <input
            type="hidden"
            name="parameters"
            value={this.state.parameters}
          />
        </form>
        <Button
          type="Button"
          onClick={this.deployToCSB}
          iconBefore={this.props.iconBefore}
        >
          Sandbox
        </Button>
      </span>
    );
  }
}
