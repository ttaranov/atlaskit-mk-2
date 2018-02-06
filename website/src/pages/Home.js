// @flow
import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import Page from '../components/Page';
import { Link } from 'react-router-dom';

import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import { borderRadius, colors } from '@atlaskit/theme';
import PackagesIcon from '@atlaskit/icon/glyph/component';
import DocumentationIcon from '@atlaskit/icon/glyph/overview';
import PatternsIcon from '@atlaskit/icon/glyph/issues';

import atlasKitLogo from '../assets/atlaskit-logo.png';

type HomeProps = {};
const gutter = '12px';
const fonts =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const Title = styled.h1`
  color: ${colors.N0};
  ${'' /* font-family: "LLCircularWeb-Medium", ${fonts}; */} font-size: 52px;
  margin: 80px 0 0 !important;
`;
const Intro = styled.div`
  color: ${colors.N0};
  display: inline-block;
  font-size: 24px;
  ${'' /* font-family: "LLCircularWeb-Book", ${fonts}; */} font-weight: 300;
  margin-bottom: 60px;
  margin-top: 20px;
  max-width: 640px;

  a {
    color: ${colors.B75};

    &:hover {
      color: ${colors.N0};
    }
  }
`;

// ========== CARDS ==========

const Cards = styled.div`
  display: flex;
  margin-bottom: 60px;
  margin-left: -${gutter};
  margin-right: -${gutter};

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;
const CardLink = styled(Link)`
  background-color: ${colors.N0};
  border-radius: ${borderRadius}px;
  color: ${colors.text};
  flex: 1 1 0;
  padding: 20px;
  text-align: left;
  transition: transform 150ms;

  @media (min-width: 800px) {
    margin-left: ${gutter};
    margin-right: ${gutter};
  }
  @media (max-width: 799px) {
    margin-bottom: ${gutter};
    margin-top: ${gutter};
  }

  &:hover,
  &:focus {
    box-shadow: 0 4px 1px rgba(0, 0, 0, 0.14);
    color: inherit;
    outline: 0;
    text-decoration: none;
    transform: translateY(-3px);
  }
  &:active {
    box-shadow: none;
    transition: none;
    transform: translateY(-1px);
  }
`;
const CardTitle = styled.div`
  align-items: center;
  display: flex;
  font-weight: 500;
`;
const CardTitleText = styled.h3`
  font-size: 14px;
  margin: 0;
`;
const CardBody = styled.div`
  color: ${colors.subtleText}
  margin-top: 8px;
  padding-left: 10px;
`;
const CardIcon = styled.span`
  align-items: center;
  background-color: ${p => p.color};
  border-radius: 4px;
  border: 2px solid ${colors.N0};
  display: flex;
  height: 24px;
  justify-content: center;
  margin-left: -26px;
  margin-right: 8px;
  width: 24px;
`;

const Card = ({ children, icon: Icon, iconColor, title, ...props }) => (
  <CardLink {...props}>
    <CardTitle>
      <CardIcon color={iconColor}>
        <Icon label={title} primaryColor={colors.N0} size="small" />
      </CardIcon>
      <CardTitleText>{title}</CardTitleText>
    </CardTitle>
    <CardBody>{children}</CardBody>
  </CardLink>
);

// ========== PAGE ==========

// less the width of global nav bar
const PageOffset = styled.div`
  text-align: center;

  @media (min-width: 800px) {
    margin-left: -64px;
  }
`;

// ========== BUTTONS ==========

const Button = styled.a`
  border-radius: ${borderRadius}px;
  color: ${colors.B75};
  display: inline-block;
  line-height: 2.6;
  padding-left: 16px;
  padding-right: 16px;
  transition: background-color 150ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    color: ${colors.N0};
    text-decoration: none;
  }
`;
const Style = () => (
  <style>{`
  body {
    background-color: ${colors.B500};
  }
`}</style>
);

export default class Home extends React.Component<HomeProps> {
  props: HomeProps;

  render() {
    return (
      <PageOffset>
        <Style />
        <Page width="large">
          <Title>Atlaskit</Title>
          <Intro>
            Atlassian&#39;s official UI library, built according to the{' '}
            <a
              href="//www.atlassian.design"
              target="_blank"
              rel="noopener noreferrer"
            >
              Atlassian&nbsp;Design&nbsp;Guidelines
            </a>{' '}
            (ADG).
          </Intro>
          <Cards>
            <Card
              to="/docs"
              icon={DocumentationIcon}
              iconColor={colors.P300}
              title="Documentation"
            >
              A detailed dive into the decisions that shaped this project.
            </Card>
            <Card
              to="/packages"
              icon={PackagesIcon}
              iconColor={colors.R300}
              title="Packages"
            >
              Documentation and usage guides for the packages in Atlaskit.
            </Card>
            {/* <Card
              to="/patterns"
              icon={PatternsIcon}
              iconColor={colors.G300}
              title="Patterns"
            >
              Common ways to combine packages together for your application.
            </Card> */}
          </Cards>
          <Button
            href="//bitbucket.org/atlassian/atlaskit/src/HEAD/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contribution Guide
          </Button>
          <Button
            href="//atlassian.design"
            target="_blank"
            rel="noopener noreferrer"
          >
            Design Guidelines
          </Button>
        </Page>
      </PageOffset>
    );
  }
}
