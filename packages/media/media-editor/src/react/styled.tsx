import styled, { ThemedOuterStyledProps } from 'styled-components';

import {
  HTMLAttributes,
  ComponentClass,
  CanvasHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import {
  akColorN40,
  akColorN50A,
  akColorN90,
  akColorN200,
  akColorN600A,
} from '@atlaskit/util-shared-styles';
import { ButtonProps } from './toolbarButtons';

export interface ToolbarButtonProps {
  selected: boolean;
  onClick: () => void;
}

export interface LineWidthFrontCircleProps {
  width: number;
}

export const EditorContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: relative;
`;

export const OutputArea: ComponentClass<
  HTMLAttributes<{}> & ThemedOuterStyledProps<{}, {}>
> = styled.div`
  position: absolute;
  overflow: hidden;
`;

export const DrawingCanvas: ComponentClass<
  CanvasHTMLAttributes<{}> & ThemedOuterStyledProps<{}, {}>
> = styled.canvas`
  position: absolute;
  left: 0;
  top: 0;
`;

export const SupplementaryCanvas: ComponentClass<
  CanvasHTMLAttributes<{}> & ThemedOuterStyledProps<{}, {}>
> = styled.canvas`
  position: absolute;
  display: none;
  left: 0;
  top: 0;
`;

// TODO Check with transparent canvas, because DefaultKeyboardInput makes the text area visible to get focus.
// https://jira.atlassian.com/browse/FIL-4059
export const HiddenTextArea: ComponentClass<
  TextareaHTMLAttributes<{}> & ThemedOuterStyledProps<{}, {}>
> = styled.textarea`
  position: absolute;
  display: block;
  visibility: hidden; /* display:none won't allow to get the keyboard focus */
  left: 0;
  top: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  resize: none;
  opacity: 0;
`;

export const HiddenTextHelperDiv: ComponentClass<
  HTMLAttributes<{}> & ThemedOuterStyledProps<{}, {}>
> = styled.div`
  position: absolute;
  display: block;
  visibility: hidden; /* display:none won't allow us to call getClientBoundingRect() for children */
  left: 0;
  top: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  white-space: pre; /* to preserve multiple whitespace characters and not to break lines */
`;

export const ToolbarContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 32px;
  height: 392px;
  background-color: ${akColorN600A};
  border-radius: 4px;
  padding: 8px;
`;

export const ToolbarButton: ComponentClass<
  HTMLAttributes<{}> & ButtonProps
> = styled.div`
  display: inline-block;
  width: 32px;
  height: 32px;
  background-color: ${(props: ButtonProps) =>
    props.selected ? akColorN90 : 'transparent'};
  border-radius: 4px;

  &:hover {
    background-color: ${akColorN90};
  }
`;

export const ColorSquare: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 20px;
  height: 20px;
  margin: 4px;
  background-color: ${props => props.color || 'transparent'};
  border-radius: 4px;
  border-width: 2px;
  border-color: ${akColorN50A};
  border-style: solid;
`;

export const LineWidthBackCircle: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 6px;
  background-color: ${akColorN200};
  border-radius: 10px;
`;

export const LineWidthFrontCircle: ComponentClass<
  HTMLAttributes<{}> & LineWidthFrontCircleProps
> = styled.div`
  width: ${(props: LineWidthFrontCircleProps) =>
    props.width ? `${props.width}px` : '0'};
  height: ${(props: LineWidthFrontCircleProps) =>
    props.width ? `${props.width}px` : '0'};
  background-color: ${akColorN40};
  border-radius: 50%;
  margin: ${(props: LineWidthFrontCircleProps) =>
    props.width ? `${10 - props.width / 2}px` : '0'};
`;

export const ToolIcon: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 20px;
  height: 20px;
  margin: 4px;
  color: ${akColorN40};
`;
