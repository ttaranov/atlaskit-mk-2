// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { borderRadius, colors, gridSize, math, themed } from '@atlaskit/theme';

import Description from './Description';
import { H2 } from './Heading';
import PrettyPropType from './PrettyPropType';

const Heading = styled.h3`
  border-bottom: 2px solid ${themed({ light: colors.N20, dark: colors.DN40 })};
  font-size: 0.9rem;
  font-weight: normal;
  line-height: 1.4;
  margin: 0 0 ${gridSize}px 0;
  padding-bottom: ${gridSize}px;
`;
const HeadingDefault = styled.code`
  color: ${themed({ light: colors.subtleText, dark: colors.subtleText })};
`;
const HeadingRequired = styled.span`
  color: ${themed({ light: colors.R500, dark: colors.R300 })};
`;
const HeadingType = styled.span`
  background: ${themed({ light: colors.B50, dark: colors.B500 })};
  border-radius: ${borderRadius}px;
  color: ${themed({ light: colors.B500, dark: colors.B50 })};
  display: inline-block;
  padding: 0 0.2em;
`;
const PropTypeWrapper = styled.div`
  margin-top: ${math.multiply(gridSize, 4)}px;
`;

const Wrapper = styled.div`
  border-top: 2px solid ${themed({ light: colors.N20, dark: colors.DN40 })};
  margin-top: ${math.multiply(gridSize, 1.5)}px;

  @media (min-width: 780px) {
    margin-bottom: ${math.multiply(gridSize, 3)}px;
    margin-top: ${math.multiply(gridSize, 3)}px;
  }
`;

// Disable prop types validation for internal functional components
/* eslint-disable react/prop-types */

const PageWrapper = ({ children }) => (
  <Wrapper>
    <H2>Props</H2>
    {children}
  </Wrapper>
);

const PropTypeHeading = ({ defaultValue, name, required, type }) => {
  let typeName = type.kind;
  if (typeName === 'nullable') {
    typeName = `?${type.arguments.kind}`;
  }

  return (<Heading>
    <code>
      <HeadingType>{typeName}</HeadingType> {name}
      {defaultValue ? <HeadingDefault> = {defaultValue.value}</HeadingDefault> : null}
      {required ? <HeadingRequired> required</HeadingRequired> : null}
    </code>
  </Heading>);
};

/* eslint-enable react/prop-types */

export default class DynamicProps extends Component {
  static propTypes = {
    props: PropTypes.Object,
  }

  render() {
    if (!this.props.props || !this.props.props.classes) return null;

    const props = this.props.props.classes[0].props;

    return (
      <PageWrapper>
        {props.map((prop) => {
          if (!prop.value) {
            console.error(`Prop ${prop.key} has no type; this usually indicates invalid propType or defaultProps config`); // eslint-disable-line no-console
            return null;
          }
          return (
            <PropTypeWrapper key={prop.key}>
              <PropTypeHeading
                name={prop.key}
                required={!prop.optional}
                type={prop.value}
              />
              {prop.description && <Description>{prop.description}</Description>}
              <PrettyPropType type={prop.value} />
            </PropTypeWrapper>
          );
        })}
      </PageWrapper>
    );
  }
}
