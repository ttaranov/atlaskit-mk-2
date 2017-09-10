// @flow
import React, { Children, PureComponent } from 'react';

import ReactMarkdown from 'react-markdown';
import semver from 'semver';
import styled, { css } from 'styled-components';
import { math, gridSize, colors, borderRadius } from '@atlaskit/theme';

const gutter = `${math.multiply(gridSize, 3)()}px`;

const H3 = styled.h3`
  color: ${colors.N200};
  font-size: 18px;
  font-weight: normal;
`;
const Heading = (
  { children, level, packageName }:
  { children: Array<mixed>, level: number, packageName: string }
) :any => {
  if (level !== 2) return children;
  const childrenArray = Children.toArray(children);
  if (childrenArray.length !== 1) return children;
  const title = childrenArray[0];
  if (typeof title !== 'string') return children;

  const version = title.match(/^(\d+\.\d+\.\d+)\s+\(([^)]+)\)/);
  if (!version) return children;

  const versionNumber = version[1];
  const versionDate = version[2];

  const href = `https://bitbucket.org/atlassian/atlaskit/commits/tag/%40atlaskit%2F${packageName}%40${versionNumber}`;
  const anchorProps = { href, rel: 'noopener noreferrer', style: { fontWeight: 500 }, target: '_blank' };

  return (
    <H3>
      <a {...anchorProps}>{versionNumber}</a>
      <small> &mdash; {versionDate}</small>
    </H3>
  );
};

const LogItem = styled.div`
  margin-bottom: 1em;

  ${p => (p.major ? css`&:not(:first-child) {
    border-top: 2px solid ${colors.N30};
    margin-top: ${gutter};
    padding-top: ${gutter};
  }` : null)}
`;

export const NoMatch = styled.div`
  align-items: center;
  background-color: ${colors.N20};
  border-radius: ${borderRadius()};
  color: ${colors.N200};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: ${gutter}px;
  min-height: 120px;
`;

export type Logs = Array<{ md: string, version: string }>;

type Props = {
  changelog: Logs,
  range: string,
  packageName: string,
};

export default class ChangeLog extends PureComponent {
  props: Props; // eslint-disable-line react/sort-comp
  render(): React.Element<any> {
    const { changelog, packageName, range } = this.props;
    const logs = range
      ? changelog.filter(e => semver.satisfies(e.version, range))
      : changelog;

    let currentMajor = 0;

    return (
      <div>
        {!logs.length ? (
          <NoMatch>
            No matching versions, please try again.
          </NoMatch>
        ) : logs.map((v, i) => {
          const major = v.version.substr(0, 1);
          const majorHasChanged = currentMajor !== major;
          currentMajor = major;

          return (
            <LogItem key={i} major={majorHasChanged}>
              <ReactMarkdown
                escapeHtml
                source={v.md}
                renderers={{
                  Heading: props => <Heading packageName={packageName} {...props} />,
                }}
              />
            </LogItem>
          );
        })}
      </div>
    );
  }
}
