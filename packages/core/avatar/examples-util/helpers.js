// @flow
import React from 'react';
import type { Node } from 'react';
import { css } from 'emotion';
import { colors, math, gridSize } from '@atlaskit/theme';

const Wrapper = props => (
  <div
    className={css({
      marginTop: `${gridSize()}px;`,
    })}
    {...props}
  />
);

const ChildrenWrapper = props => (
  <div
    className={css({
      alignItems: 'baseline',
      color: colors.text,
      display: 'flex',
      '> *': {
        marginRight: `${gridSize()}px;`,
      },
    })}
    {...props}
  />
);

export const Note = (props: { size: string }) => (
  <p
    className={css({
      color: colors.N100,
      fontSize: props.size === 'large' ? '1.15em' : '0.9rem',
      marginTop: `${math.divide(gridSize, 2)()}px;`,
      marginBottom: `${math.multiply(gridSize, 2)()}px;`,
    })}
    {...props}
  />
);

export const Code = props => (
  <code
    className={css({
      backgroundColor: colors.R50,
      borderRadius: '0.2em',
      color: colors.R400,
      fontSize: '0.85em',
      lineHeight: 1.1,
      padding: '0.1em 0.4em;',
    })}
    {...props}
  />
);

const GapCSS = {
  marginRight: `${gridSize()}px;`,
};

export const Gap = props => <span className={css(GapCSS)} {...props} />;

const ShrinkWrapCSS = {
  ...GapCSS,
  height: `${math.multiply(gridSize, 3)()}px;`,
  width: `${math.multiply(gridSize, 3)()}px;`,
};

export const ShrinkWrap = props => (
  <span className={css(ShrinkWrapCSS)} {...props} />
);

export const Heading = props => (
  <div
    className={css({
      color: colors.subtleHeading,
      display: 'flex',
      fontSize: '0.8rem',
      fontWeight: 500,
      marginBottom: '0.5em;',
      textTransform: 'uppercase;',
    })}
    {...props}
  />
);

export const Block = ({
  children,
  heading,
}: {
  children: ?Node,
  heading?: string,
}) => (
  <Wrapper>
    {heading ? <Heading>{heading}</Heading> : null}
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </Wrapper>
);
