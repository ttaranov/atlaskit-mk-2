import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

export const TimelineContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  cursor: -webkit-grab;
  cursor: -moz-grab;

  overflow-x: hidden;
`;

export const TimelineEntry: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: relative;
  padding: 12px;
  margin: 8px;
  border-radius: 5px;
  color: white;
`;
