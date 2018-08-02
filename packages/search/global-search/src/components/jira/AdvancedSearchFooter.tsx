import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { colors, gridSize, math } from '@atlaskit/theme';

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid ${colors.N40};
  padding: ${gridSize}px 0;
`;

export interface Props {
  query: string;
}

export default class AdvancedSearchFooter extends React.Component<Props> {
  render() {
    const { query } = this.props;

    return [
      <StickyFooter key="advanced-search">
        <span>TODO advanced jira search dropdown</span>
      </StickyFooter>,
    ];
  }
}
