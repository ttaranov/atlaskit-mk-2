// @flow
import React, { type Node } from 'react';
import styled from 'styled-components';
import { borderRadius, colors, gridSize, math, themed } from '@atlaskit/theme';
import convert, { getKind } from 'kind2string';
import md from 'react-markings';

import Description from './Description';
import PrettyPropType from './PrettyPropType';
import { H2 } from './Heading';

const Heading = styled.h3`
  border-bottom: 2px solid ${themed({ light: colors.N20, dark: colors.DN40 })};
  font-size: 0.9rem;
  font-weight: normal;
  line-height: 1.4;
  margin: 0 0 ${gridSize}px 0;
  padding-bottom: ${gridSize}px;
`;

const HeadingDefault = styled.code`
  color: ${colors.subtleText};
`;

const HeadingRequired = styled.span`
  color: ${themed({ light: colors.R500, dark: colors.R300 })};
`;

const HeadingType = styled.span`
  background: ${themed({ light: colors.N20, dark: colors.DN20 })};
  border-radius: ${borderRadius}px;
  color: ${themed({ light: colors.N300, dark: colors.DN300 })};
  display: inline-block;
  padding: 0 0.2em;
`;
const HeadingName = styled.span`
  background: ${themed({ light: colors.B50, dark: colors.B500 })};
  color: ${themed({ light: colors.B500, dark: colors.B50 })};
  border-radius: ${borderRadius}px;
  display: inline-block;
  margin-right: 0.8em;
  padding: 0 0.2em;
`;

const PropTypeWrapper = styled.div`
  margin-top: ${math.multiply(gridSize, 4)}px;
`;

const Wrapper = styled.div`
  margin-top: ${math.multiply(gridSize, 1.5)}px;

  @media (min-width: 780px) {
    margin-bottom: ${math.multiply(gridSize, 3)}px;
    margin-top: ${math.multiply(gridSize, 3)}px;
  }
`;

const PageWrapper = ({
  children,
  heading,
}: {
  children: Node,
  heading?: string,
}) => (
  <Wrapper>
    {typeof heading === 'string' && heading.length === 0 ? null : (
      <H2>{heading || 'Props'}</H2>
    )}
    {children}
  </Wrapper>
);

type PropTypeHeadingProps = {
  name: any,
  required: boolean,
  type: any,
  // This is probably giving up
  defaultValue?: any,
};

function PropTypeHeading(props: PropTypeHeadingProps) {
  return (
    <Heading>
      <code>
        <HeadingName>{props.name}</HeadingName>
        <HeadingType>{props.type}</HeadingType>
        {props.defaultValue && (
          <HeadingDefault> = {props.defaultValue}</HeadingDefault>
        )}
        {props.required ? <HeadingRequired> required</HeadingRequired> : null}
      </code>
    </Heading>
  );
}

const reduceToObj = type => {
  if (type.kind === 'generic') {
    return reduceToObj(type.value);
  } else if (type.kind === 'object') {
    return type.members;
  } else if (type.kind === 'intersection') {
    return type.types.reduce((acc, i) => [...acc, ...reduceToObj(i)], []);
  }
  // eslint-disable-next-line no-console
  console.warn('was expecting to reduce to an object and could not', type);
  return [];
};

type Obj = {
  kind: 'object',
  members: Array<any>,
};

type Gen = {
  kind: 'generic',
  value: any,
};

type Inter = {
  kind: 'intersection',
  types: Array<Obj | Gen>,
};

type DynamicPropsProps = {
  heading?: string,
  props: {
    classes?: Array<{
      kind: string,
      value: Obj | Inter,
    }>,
  },
};

const getPropTypes = propTypesObj => {
  let propTypes;
  if (propTypesObj.kind === 'object') {
    propTypes = propTypesObj.members;
  } else if (propTypesObj.kind === 'intersection') {
    propTypes = propTypesObj.types.reduce(
      (acc, type) => [...acc, ...reduceToObj(type)],
      [],
    );
  }
  return propTypes;
};

const renderPropType = propType => {
  if (propType.kind === 'spread') {
    const furtherProps = reduceToObj(propType.value);
    return furtherProps.map(renderPropType);
  }

  let description;
  if (propType.leadingComments) {
    description = propType.leadingComments.reduce(
      (acc, { value }) => acc.concat(`\n${value}`),
      '',
    );
  }

  if (!propType.value) {
    // eslint-disable-next-line no-console
    console.error(
      `Prop ${
        propType.key
      } has no type; this usually indicates invalid propType or defaultProps config`,
    );
    return null;
  }

  return (
    <PropTypeWrapper key={convert(propType.key)}>
      <PropTypeHeading
        name={convert(propType.key)}
        required={!propType.optional}
        type={getKind(propType.value)}
        defaultValue={propType.default && convert(propType.default)}
      />
      {description && <Description>{md([description])}</Description>}
      <PrettyPropType type={propType.value} />
    </PropTypeWrapper>
  );
};

export default function DynamicProps(props: DynamicPropsProps) {
  const classes = props.props && props.props.classes;
  if (!classes) return null;

  const propTypesObj = classes[0] && classes[0].value;
  if (!propTypesObj) return null;

  const propTypes = getPropTypes(propTypesObj);
  if (!propTypes) return null;

  return (
    <PageWrapper heading={props.heading}>
      {propTypes.map(renderPropType)}
    </PageWrapper>
  );
}
