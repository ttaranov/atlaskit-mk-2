import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

export interface TimelineContainerProps {
  dragging?: boolean;
}

export const TimelineContainer: ComponentClass<
  HTMLAttributes<{}> & TimelineContainerProps
> = styled.div`
  ${props =>
    (props as TimelineContainerProps).dragging
      ? `
  cursor: -webkit-grabbing;
  cursor: -moz-grabbing;
  cursor: grabbing;`
      : `
  cursor: -webkit-grab;
  cursor: -moz-grab;
  cursor: grab;`} overflow-x: hidden;
`;

export const TimelineEntry: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: relative;
  padding: 12px;
  margin: 8px;
  border-radius: 5px;
  color: white;
`;
