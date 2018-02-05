/* @flow */

import React from 'react';
import Page, { Title, Section } from '../components/Page';
import { externalPackages as packages, pkgData, getConfig } from '../site';
import Table from '@atlaskit/dynamic-table';
import styled from 'styled-components';
import * as fs from '../utils/fs';
import { borderRadius, colors, gridSize, math, themed } from '@atlaskit/theme';
import Loadable from 'react-loadable';
import Loading from '../components/Loading';

const navdata: Object = pkgData;

const head = {
  cells: [
    {
      key: 'name',
      content: 'Name',
      isSortable: true,
      width: 15,
    },
    {
      key: 'description',
      content: 'Description',
      shouldTruncate: true,
      isSortable: false,
      width: 45,
    },
    {
      key: 'publishTime',
      content: 'Latest',
      shouldTruncate: true,
      isSortable: false,
      width: 20,
    },
    {
      key: 'team',
      content: 'Team',
      shouldTruncate: true,
      isSortable: true,
      width: 20,
    },
    {
      key: 'maintainers',
      content: 'Maintainers',
      shouldTruncate: true,
      isSortable: false,
      width: 20,
    },
  ],
};

const renderRow = (
  {
    name: packageName,
    description,
    maintainers,
    // lastPublishedOn,
    version,
  },
  { id },
  groupId,
) => {
  return {
    cells: [
      {
        key: id,
        content: (
          <RowCell>
            <a href={`/mk-2/packages/${groupId}/${id}`}>{fs.titleize(id)}</a>
          </RowCell>
        ),
      },
      {
        key: 'description',
        shouldTruncate: true,
        content: <RowCell>{description}</RowCell>,
      },
      {
        key: 'publishTime',
        // new website structure does not have an easy way to get date of last
        // release, so we are skipping it for now.
        content: (
          <RowCell>
            <a
              href={`https://www.npmjs.com/package/${packageName}`}
              target="_new"
            >
              {version}
            </a>
            {null}

            {/* {publishTime ? (
                  <Time dateTime={component.publishedDate}>
                    {' '}({component.publishedDate && new Date(component.publishedDate).toLocaleDateString()})
                  </Time>
                ) : null} */}
          </RowCell>
        ),
      },
      {
        key: groupId,
        content: <RowCell>{fs.titleize(groupId)}</RowCell>,
      },
      {
        content: (
          <RowCell>
            {maintainers && maintainers.map(val => val.name || val).join(', ')}
          </RowCell>
        ),
      },
    ],
  };
};

const StatRows = () =>
  fs.getDirectories(packages.children).reduce(
    (acc, team) =>
      acc.concat(
        fs.getDirectories(team.children).map(pkg => {
          const pkgJSON = getConfig(team.id, pkg.id).config;

          return renderRow(pkgJSON, pkg, team.id);
        }),
      ),
    [],
  );

export default function PackagesList() {
  return (
    <Page width="large">
      <Title>All Packages</Title>
      <Section>
        <Table
          head={head}
          rows={StatRows()}
          isFixedSize
          defaultSortKey="name"
          defaultSortOrder="ASC"
        />
      </Section>
    </Page>
  );
}

// Tabular data
const RowCell = styled.div`
  padding-bottom: ${gridSize}px;
  padding-top: ${gridSize}px;
`;
const Time = styled.time`
  color: ${themed({ dark: colors.DN80, light: colors.N80 })};
`;
