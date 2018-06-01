import * as React from 'react';
import // akBorderRadius,
// akGridSizeUnitless,
// akColorG50,
// akColorG300,
// akColorR300,
'@atlaskit/util-shared-styles';
import styled from 'styled-components';

const diffColor = {
  delete: 'rgba(255, 86, 48, .3)',
  insert: 'rgba(54, 179, 126, .3)',
  change: 'rgba(0, 184, 217, .3)',
};

const diffBackground = ({ diffType }: Props) => {
  return `background-color: ${diffColor[diffType]};`;
};

const diffStyle = ({ diffType }: Props) => {
  switch (diffType) {
    case 'delete':
      return 'text-decoration: line-through;';
  }

  return '';
};

const StyledDiff = styled.span`
  ${diffBackground} ${diffStyle} border-radius: 3px;
`;

const StyledBlockDiff = styled.div`
  ${diffBackground} ${diffStyle} border-radius: 3px;
  box-sizing: border-box;
  padding: 10px;
`;

export interface Props {
  diffType: 'delete' | 'insert' | 'change';
}

export function InlineDiff(props: Props & React.Props<any>) {
  const { diffType } = props;
  return <StyledDiff diffType={diffType}>{props.children}</StyledDiff>;
}

export function BlockDiff(props: Props & React.Props<any>) {
  const { diffType } = props;
  return (
    <StyledBlockDiff diffType={diffType}>{props.children}</StyledBlockDiff>
  );
}
