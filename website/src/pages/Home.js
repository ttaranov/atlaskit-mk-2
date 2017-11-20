// @flow
import React from 'react';
import Page, { Intro, Section } from '../components/Page';
import { Link } from 'react-router-dom';

type HomeProps = {};

const IntroContent = props => (
  <Intro {...props}>
    Atlaskit is Atlassian&#39;s official UI library, built according to the{' '}
    <a href="//www.atlassian.design" target="_blank" rel="noopener noreferrer">
      Atlassian Design Guidelines
    </a>{' '}
    (ADG).
  </Intro>
);
const GettingStartedContent = () => (
  <Section>
    <h3>Getting started</h3>
    <p>
      To learn how to get ADG into your projects, check out the{' '}
      <Link to="/docs/getting-started">getting started guide</Link>.
    </p>
  </Section>
);
const GettingInvolvedContent = () => (
  <Section>
    <h3>Getting involved</h3>
    <p>
      We welcome issue and code contributions. Please start by reading our{' '}
      <a
        href="//bitbucket.org/atlassian/atlaskit/src/HEAD/CONTRIBUTING.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        contribution guide
      </a>.
    </p>
  </Section>
);

export default class Home extends React.PureComponent<HomeProps> {
  props: HomeProps;

  render() {
    return (
      <Page>
        <h1>Atlaskit</h1>
        <IntroContent />
        <GettingStartedContent />
        <GettingInvolvedContent />
      </Page>
    );
  }
}
