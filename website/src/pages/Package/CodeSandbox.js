import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Loadable from 'react-loadable';

import CodeSandboxLogo from './CodeSandboxLogo';
import csbLoading from './csbLoading';
import CodeSandboxDeployer from 'react-codesandboxer';

const codesandboxURL = 'https://codesandbox.io/api/v1/sandboxes/define';
const { NavButton } = require('../Examples/styled');

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

    // move config and baseFiles to csbLoading
    const config = ({ extraImports, extraFiles }) => ({
      originLocation: '../src',
      providedDeps: { '@atlaskit/css-reset': 'latest', ...extraImports },
      providedFiles: {
        ...baseFiles(groupId, packageId, example.Id),
        ...extraFiles,
      },
    });

    const ExampleComponent = Loadable({
      loader: () => csbLoading(example, groupId, packageId, pkgJSON),
      loading: loadingButton,
      render({
        loadedExample,
        extraFiles,
        simpleImports,
        trickyImports,
        extraImports,
      }) {
        return (
          <CodeSandboxDeployer
            skipDeploy
            afterDeploy={all => console.log(all)}
            example={loadedExample}
            pkgJSON={pkgJSON}
            config={config({ extraFiles, extraImports })}
          >
            {deployButton({ isDisabled: trickyImports })}
          </CodeSandboxDeployer>
        );
      },
    });

    return <ExampleComponent />;
  }
}
