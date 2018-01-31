import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Loadable from 'react-loadable';

import CodeSandboxLogo from './CodeSandboxLogo';
import CodeSandboxDeployer, {
  getCSBData,
  getAllImports,
} from '../../utils/CodeSandboxDeployer';

const codesandboxURL = 'https://codesandbox.io/api/v1/sandboxes/define';
const { NavButton } = require('../Examples/styled');

const basePath = 'bitbucket.org/atlassian/atlaskit-mk-2/raw/HEAD/packages/';

const getExampleUrl = (groupId, packageId, exampleId) =>
  `https://bitbucket.org/atlassian/atlaskit-mk-2/raw/HEAD/packages/${groupId}/${packageId}/examples/${exampleId}`;
const repoUrl = 'https://bitbucket.org/atlassian/atlaskit-mk-2';

const baseFiles = (groupId, packageId, exampleId) => ({
  'index.js': {
    content: `/**
  This CodeSandbox has been automatically generated from the contents of ${getExampleUrl(
    groupId,
    packageId,
    exampleId,
  )}.

  This generator does not follow relative imports beyond those that reference the
  module root, and as such, other relative imports may fail to load.

  You can look up the relative imports from ${repoUrl}

  If this fails in any other way, contact Ben Conolly (https://bitbucket.org/bconolly)
*/
import React from 'react';
import ReactDOM from 'react-dom';
import '@atlaskit/css-reset';
import Example from './example';

ReactDOM.render(
<Example />,
document.getElementById('root')
);`,
  },
});

export default class CodeSandbox extends Component<{}, {}> {
  state = { parameters: '' };
  deployToCSB = e => {
    e.preventDefault();
    const { pkgJSON, example, groupId, packageId } = this.props;

    example
      .contents()
      .then(exampleData =>
        CSB2Transformer(exampleData, pkgJSON, {
          originLocation: '../src',
          startingDeps: { '@atlaskit/css-reset': 'latest' },
          providedFiles: baseFiles(groupId, packageId, example.Id),
        }),
      )
      .then(({ params }) => {
        this.setState({ parameters: params });
      })
      .then(() => this.form.submit())
      .catch(e => console.error(e));
  };

  render() {
    const {
      deployButton,
      example,
      examples,
      groupId,
      loadingButton,
      packageId,
      pkgJSON,
    } = this.props;

    const config = {
      originLocation: '../src',
      startingDeps: { '@atlaskit/css-reset': 'latest' },
      providedFiles: baseFiles(groupId, packageId, example.Id),
    };

    const ExampleComponent = Loadable({
      loader: () => example.contents(),
      loading: loadingButton,
      render(loadedExample) {
        let isDisabled = false;

        const imports = getAllImports(loadedExample);
        for (let mpt of imports) {
          let [complete, source] = mpt;
          if (source === '../src') {
            // handle the source directory
          } else if (/^\.\.\//.test(source)) {
            // If we are trying to deploy things from places other than the source,
            // we will not be able to reference them. Do not let this example be
            // deployed to codesandbox
            isDisabled = true;
          } else if (/^\.\//.test(source)) {
            // This is if it is another file in the examples directory. We want
            // to handle this, but not at first implementation
            isDisabled = true;
          } else {
            // We are acting on an external import, this is fine
          }
        }

        return (
          <CodeSandboxDeployer
            example={loadedExample}
            pkgJSON={pkgJSON}
            config={config}
          >
            {deployButton({ isDisabled })}
          </CodeSandboxDeployer>
        );
      },
    });

    return <ExampleComponent />;
  }
}
