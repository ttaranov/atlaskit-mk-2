// @flow
import React from 'react';
import styled, { injectGlobal, css } from 'styled-components';
import Page from '../components/Page';
import { Link } from 'react-router-dom';
import { Grid, GridColumn } from '@atlaskit/page';

import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import { borderRadius, colors } from '@atlaskit/theme';
import PackagesIcon from '@atlaskit/icon/glyph/component';
import DocumentationIcon from '@atlaskit/icon/glyph/overview';
import PatternsIcon from '@atlaskit/icon/glyph/issues';
import BlogIcon from '@atlaskit/icon/glyph/objects/24/blog';
import MediaDocIcon from '@atlaskit/icon/glyph/media-services/document';
import CodeIcon from '@atlaskit/icon/glyph/code';

import rocket from '../assets/Rocket.png';
import platform from '../assets/Platform.png';
import multiTool from '../assets/multiTool.png';

const gutter = '6px';
const fonts =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';

const Title = styled.h1`
  color: ${colors.N0};
  font-family: 'LLCircularWeb-Medium', ${fonts}; /* stylelint-disable-line */
  font-size: 52px;
  margin: 80px 0 0 !important;
`;
const Intro = styled.div`
  color: ${colors.N0};
  display: inline-block;
  font-size: 24px;
  font-family: 'LLCircularWeb-Book', ${fonts}; /* stylelint-disable-line */
  font-weight: 300;
  margin-bottom: 80px;
  margin-top: 24px;
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
  flex-wrap: wrap;
  margin-bottom: 80px;
  margin-left: -${gutter};
  margin-right: -${gutter};

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const cardlinkStyles = css`
  background-color: ${colors.N0};
  border-radius: ${borderRadius}px;
  color: ${colors.text};
  flex: 1 1 0;
  padding: 16px 0;
  text-align: left;
  transition: transform 150ms;
  margin-bottom: ${gutter};
  margin-top: ${gutter};

  @media (min-width: 800px) {
    margin-left: ${gutter};
    margin-right: ${gutter};
    min-width: calc(30% - 50px);
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
const CardLinkInt = styled(Link)`
  ${cardlinkStyles};
`;

// $FlowFixMe - strings are valid arguments of styled
const CardLinkExt = styled('a')`
  ${cardlinkStyles};
`;
const CardTitle = styled.div`
  align-items: center;
  display: flex;
  font-weight: 500;
  padding: 16px 24px;
`;
const CardTitleText = styled.h3`
  font-size: 14px;
  margin: 0;
`;
const CardBody = styled.div`
  color: ${colors.subtleText};
  margin: 8px 24px;
`;
const CardIcon = styled.span`
  align-items: center;
  background-color: ${p => p.color};
  border-radius: 4px;
  border: 2px solid ${colors.N0};
  display: flex;
  height: 24px;
  justify-content: center;
  margin-right: 8px;
  width: 24px;
`;

const Img = ({ src }) => (
  <img
    style={{
      margin: '10px auto',
      height: '200px',
      display: 'block',
    }}
    src={src}
  />
);

type CardProps = {
  imgSrc?: any,
  children: any,
  icon: () => any,
  title: string,
};

const Card = ({
  children,
  icon: Icon,
  iconColor,
  title,
  imgSrc,
  ...props
}: CardProps) => {
  const CardLink = props.href ? CardLinkExt : CardLinkInt;
  return (
    <CardLink {...props}>
      <CardTitle>
        <Icon />
        <CardTitleText>{title}</CardTitleText>
      </CardTitle>
      <CardBody>{children}</CardBody>
      {imgSrc ? <Img src={imgSrc} /> : null}
    </CardLink>
  );
};

// ========== PAGE ==========

// less the width of global nav bar
const PageOffset = styled.div`
  text-align: center;

  @media (min-width: 800px) {
    margin-right: 64px;
  }
`;

// ========== BUTTONS ==========

const Style = () => (
  <style>{`
  body {
    background-color: ${colors.B500};
  }
`}</style>
);

export default class Home extends React.Component<{}> {
  render() {
    return (
      <PageOffset>
        <Style />
        <Page width="large">
          <Title>Atlaskit</Title>
          <Intro>
            Atlassian&#39;s official UI library, according to the
            Atlassian&nbsp;Design&nbsp;Guidelines.
          </Intro>
          <Cards>
            <Card
              to="/docs/getting-started"
              icon={() => (
                <CardIcon color={colors.R400}>
                  <MediaDocIcon
                    label="Get started with Atlaskit!"
                    primaryColor={colors.N0}
                    secondaryColor={colors.R400}
                    size="small"
                  />
                </CardIcon>
              )}
              imgSrc={rocket}
              title="Get started with Atlaskit!"
            >
              Everything you need to get up and running.
            </Card>
            <Card
              to="/packages"
              title="Components and APIs"
              imgSrc={platform}
              icon={() => (
                <CardIcon color={colors.Y400}>
                  <PackagesIcon
                    label="Components and APIs"
                    primaryColor={colors.N0}
                    secondaryColor={colors.Y400}
                    size="small"
                  />
                </CardIcon>
              )}
            >
              Check out the documentation and usage guides for the Atlaskit
              packages.
            </Card>
            <Card
              href="http://atlassian.design"
              title="Atlassian Design Guidelines"
              imgSrc={multiTool}
              icon={() => (
                <CardIcon color={colors.B400}>
                  <AtlassianIcon
                    label="Atlassian Design Guidelines"
                    primaryColor={colors.N0}
                    secondaryColor={colors.B400}
                    size="small"
                  />
                </CardIcon>
              )}
            >
              <div>Need some more design guidance? Have a look at the ADG.</div>
            </Card>
            <Card
              to="/docs/guides/contributing"
              title="Make it better"
              icon={() => (
                <CardIcon color={colors.R400}>
                  <MediaDocIcon
                    label="Make it better"
                    primaryColor={colors.N0}
                    secondaryColor={colors.R400}
                    size="small"
                  />
                </CardIcon>
              )}
            >
              Learn how to contribute code, report issues, and review our code
              of conduct.
            </Card>
            <Card
              href="https://bitbucket.org/atlassian/atlaskit-mk-2"
              title="Atlaskit Repository"
              icon={() => (
                <CardIcon color={colors.Y400}>
                  <CodeIcon
                    label="Atlaskit Repository"
                    primaryColor={colors.N0}
                    secondaryColor={colors.Y400}
                    size="small"
                  />
                </CardIcon>
              )}
            >
              Want to dive straight into the code? Check out our repo on
              Bitbucket.
            </Card>
            <Card
              href="https://developer.atlassian.com/blog/"
              iconColor={colors.P400}
              title="Atlassian Developer Blog"
              icon={() => (
                <CardIcon color={colors.N0}>
                  <BlogIcon
                    label="Atlassian Developer Blog"
                    primaryColor={colors.P400}
                    size="medium"
                  />
                </CardIcon>
              )}
            >
              Keep up to date on the latest in engineering at Atlassian.
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
        </Page>
      </PageOffset>
    );
  }
}
