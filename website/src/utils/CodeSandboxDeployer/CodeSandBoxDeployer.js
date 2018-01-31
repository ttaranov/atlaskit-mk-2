import React, { Component } from 'react';
import CSB2Transformer from './CSBTransformer';

const codesandboxURL = 'https://codesandbox.io/api/v1/sandboxes/define';

// type Props = {
//   example,
//   pkgJSON,
//   config,
//   Button,
//   afterDeploy = ({ }) => mixed,
//   children
// }

export default class CodeSandboxDeployer extends Component<{}, {}> {
  state = { parameters: '' };

  deployToCSB = e => {
    const { example, pkgJSON, config, skipDeploy, afterDeploy } = this.props;
    e.preventDefault();
    // this is always a promise, accepts example as a promise. accept pkgJSON as a promise
    CSB2Transformer(example, pkgJSON, config)
      .then(({ params, data }) => {
        this.setState({ parameters: params }, () => {
          if (!skipDeploy) this.form.submit();
          if (afterDeploy) afterDeploy({ params, data });
        });
      })
      .catch(error => {
        if (afterDeploy) afterDeploy({ error });
      });
  };

  render() {
    const {
      skipDeploy,
      example,
      pkgJSON,
      config,
      Button,
      afterDeploy,
      children,
      ...rest
    } = this.props;

    return (
      <span>
        <form
          onSubmit={this.deployToCSB}
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
          {children}
        </form>
      </span>
    );
  }
}
//
// <CodeSandboxDeployer
//   Button={<button>Click Here!</button>}
//   example={/* lots of code*/}
//   pkgJSON={/* file contents of that */}
//   config={{
//       originLocation: '../src',
//       startingDeps: { '@atlaskit/css-reset': 'latest' },
//       providedFiles: (baseFiles(groupId, packageId, example.Id))
//   }}
// />
