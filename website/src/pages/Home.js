// @flow
import React from 'react';
import Page from '../components/Page';

type HomeProps = {};

export default class Home extends React.PureComponent<HomeProps> {
  props: HomeProps;

  render() {
    return (
      <Page>
        <h1>Atlaskit</h1>
        <p>{'AtlasKit is Atlassian\'s official UI library, built according to the Atlassian Design Guidelines (ADG).'}</p>
      </Page>
    );
  }
}
