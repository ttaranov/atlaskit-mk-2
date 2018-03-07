import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Loadable from 'react-loadable';

import CodeSandboxLogo from './CodeSandboxLogo';
import CodeSandboxer from 'react-codesandboxer';

const getExampleUrl = (groupId, packageId, exampleId) =>
  `https://bitbucket.org/atlassian/atlaskit-mk-2/raw/HEAD/packages/${groupId}/${packageId}/examples/${exampleId}`;
const getExamplePath = (groupId, packageId, exampleId) =>
  `packages/${groupId}/${packageId}/examples/${exampleId}`;
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

    return (
      <CodeSandboxer
        examplePath={getExamplePath(groupId, packageId, example.id)}
        pkgJSON={pkgJSON}
        preload
        gitInfo={{
          account: 'atlassian',
          repository: 'atlaskit-mk-2',
          branch: 'master',
          host: 'bitbucket',
        }}
        importReplacements={[
          [`packages/${groupId}/${packageId}/src`, pkgJSON.name],
          ['packages/elements/icon/glyph/*', '@atlaskit/icon/glyph/'],
        ]}
        dependencies={{
          '@atlaskit/css-reset': 'latest',
          [pkgJSON.name]: pkgJSON.version,
        }}
        providedFiles={baseFiles(groupId, packageId, example.id)}
      >
        {({ isLoading }) => (isLoading ? loadingButton() : deployButton({}))}
      </CodeSandboxer>
    );
  }
}
