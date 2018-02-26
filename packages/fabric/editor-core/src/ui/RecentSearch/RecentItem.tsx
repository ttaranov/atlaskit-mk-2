import * as React from 'react';
// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
import { ActivityItem } from '@atlaskit/activity';
import {
  akColorN100,
  akColorN800,
  akColorN30,
} from '@atlaskit/util-shared-styles';

interface ContainerProps {
  selected: boolean;
}

// tslint:disable:next-line variable-name
const Container = styled.li`
  background-color: ${(props: ContainerProps) =>
    props.selected ? akColorN30 : 'transparent'};
  padding: 5px;
  cursor: pointer;
  display: flex;
`;

const NameWrapper = styled.span`
  overflow: hidden;
`;

export const Name = styled.div`
  color: ${akColorN800};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ContainerName = styled.div`
  color: ${akColorN100};
  font-size: 12px;
`;

const Icon = styled.span`
  min-width: 16px;
  margin-top: 3px;
  margin-right: 8px;
`;

export interface Props {
  item: ActivityItem;
  selected: boolean;
  onSelect: (href: string, text: string) => void;
  onMouseMove: (objectId: string) => void;
}

export default class RecentItem extends React.PureComponent<Props, {}> {
  handleSelect = e => {
    e.preventDefault(); // don't let editor lose focus
    const { item, onSelect } = this.props;
    onSelect(item.url, item.name);
  };

  handleMouseMove = () => {
    const { onMouseMove, item } = this.props;
    onMouseMove(item.objectId);
  };

  render() {
    const { item, selected } = this.props;

    return (
      <Container
        selected={selected}
        onMouseMove={this.handleMouseMove}
        onMouseDown={this.handleSelect}
      >
        <Icon>
          <img src={item.iconUrl} />
        </Icon>
        <NameWrapper>
          <Name>{item.name}</Name>
          <ContainerName>{item.container}</ContainerName>
        </NameWrapper>
      </Container>
    );
  }
}
