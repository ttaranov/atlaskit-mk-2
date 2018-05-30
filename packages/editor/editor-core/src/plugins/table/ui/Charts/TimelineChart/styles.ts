import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';

export interface TimelineContainerProps {
  dragging?: boolean;
}

export interface TimelineEntryProps {
  selected?: boolean;
  selectedColor?: string;
  color?: string;
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

export const TimelineEntryContainer: ComponentClass<
  HTMLAttributes<{}> & TimelineEntryProps
> = styled.div`
  position: relative;
  margin: 8px;
  border-radius: 5px;
  color: white;
  box-sizing: border-box;
  height: 40px;
  vertical-align: middle;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  cursor: pointer;

  &:hover {
    background-color: ${props => props.selectedColor};
  }

  background-color: ${props => props.color};
  transition: background-color 0.1s ease-out;

  ${props =>
    (props as TimelineEntryProps).selected
      ? `
    /*border: 1px solid ${(props as TimelineEntryProps).color};*/
    padding-left: 0px;
    padding-right: 0px;
    cursor: default;
    /*background-color: ${props.selectedColor}*/
  `
      : `
    padding-left: 16px;
    padding-right: 16px;
  `};
`;

export const TimelineEntryContent: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  display: flex;
  justify-content: space-between;

  & span,
  & input {
    flex: 1;
  }

  & span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const ResizeButton: ComponentClass<HTMLAttributes<{}>> = styled.div`
  cursor: ew-resize;
  content: '..';
  width: 10px;
  padding-left: 6px;
  display: inline-block;
  overflow: hidden;
  line-height: 4px;
  letter-spacing: 1px;
  color: white;

  &::after {
    cursor: ew-resize;
    content: '. . . .';
  }
`;
