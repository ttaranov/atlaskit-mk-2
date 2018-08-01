// @flow

import React from 'react';
import { ReactRenderer } from '@atlaskit/renderer';
const contentful = require('contentful');
import Loadable from 'react-loadable';
import data from '../DESIGN_SITE_DATA';
import Test from '../../../../packages/core/avatar/examples/design-examples/people-avatar-xx-large.js';
import packageResolver from '../utils/packageResolver';
import * as fs from '../utils/fs';

function Loading() {
  return <div>loading</div>;
}

const extensionHandlers = {
  'com.ajay.test': (ext, doc) => {
    const { extensionKey, parameters } = ext;
    const { componentPath } = parameters;
    const [, groupId, packageName, , , exampleName] = componentPath.split('/');

    const { examples, packageId, exampleId } = packageResolver(
      groupId,
      packageName,
      exampleName,
    );

    const LoadableComponent = Loadable({
      loader: () =>
        fs.getById(fs.getFiles(examples.children), exampleName).exports(),
      loading: () => <div>something</div>,
      render(loaded) {
        if (!loaded.default) {
          return <div>Example doesn't have default export.</div>;
        }

        return (
          <div>
            <loaded.default />
          </div>
        );
      },
    });

    switch (extensionKey) {
      case 'block-eh':
        return <LoadableComponent />;
        break;
      default:
        return null;
    }
  },
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: {},
    };
  }

  componentDidMount() {
    let client = contentful.createClient({
      space: '8j5aqoy0ts8s',
      accessToken:
        '524f57fbea94aad39f14294585a31e9aeb44a278c88ad7d82b8c03ae2611d7b2',
      host: 'preview.contentful.com',
    });

    client.getEntry(this.props.match.params.id).then(entry => {
      this.setState({
        docs: entry.fields.docs,
      });
    });

    client
      .getEntries({
        content_type: 'pages',
      })
      .then(entry => {
        console.log(entry);
      });
  }
  render() {
    console.log(this.props);
    return (
      <div>
        {this.state.docs.type === 'doc' && (
          <ReactRenderer
            document={JSON.parse(JSON.stringify(this.state.docs))}
            serializer="react"
            extensionHandlers={extensionHandlers}
          />
        )}
      </div>
    );
  }
}
