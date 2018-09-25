// @flow
import { gridSize, codeFontFamily } from '@atlaskit/theme';
import styled, { css } from 'styled-components';

export const CommitsWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const CommitsLoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Commits = styled.table`
  table-layout: fixed;
`;

export const CommitsTableBody = styled.tbody`
  ${props =>
    !props.showHeaders &&
    css`
      border-width: 0;
    `};
`;

export const TableColumn = styled.td`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TableHeader = styled.th`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const RightAlignedTableColumn = styled(TableColumn)`
  text-align: right;
`;

export const AvatarColumnDefinition = styled.col`
  width: ${gridSize() * 4.5}px;
`;

export const AuthorColumnDefinition = styled.col`
  width: ${gridSize() * 25}px;
`;

export const CommitHashColumnDefinition = styled.col`
  width: ${10 * gridSize()}px;
`;

export const DateColumnDefinition = styled.col`
  width: ${gridSize() * 15}px;
`;

export const BuildsColumnDefinition = styled.col`
  width: ${gridSize() * 8}px;
`;

export const BuildsTableHeader = styled(TableHeader)`
  text-align: center;
`;

export const BuildStatusWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const CommitSelectorColumnDefinition = styled.col`
  width: ${gridSize() * 4}px;
`;

export const CommitHash = styled.span`
  font-family: ${codeFontFamily()};
`;

export const ShowMoreBtnContainer = styled.div`
  width: 100%;
`;

export const CommitSelectorOption = styled.tr`
  ${({ hasPointerCursor }) => (hasPointerCursor ? 'cursor: pointer' : null)};
`;

// line-height: 28px / default font size of 14px, same height as avatar + padding
export const SeeAllCommitsOption = styled.span`
  line-height: 2;
  display: inline-block;
`;
