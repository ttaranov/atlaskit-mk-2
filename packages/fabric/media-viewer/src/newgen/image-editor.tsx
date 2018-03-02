import * as React from 'react';
import { MediaEditor, Toolbar, Color, Dimensions, Tool, LoadParameters } from '@atlaskit/media-editor';
import styled from 'styled-components';

let loadParameters: LoadParameters;

export type Model = {
  url: string;
  toolbarColor: Color;
};

export type Message = {
  type: 'TOOLBAR_COLOR_CHANGE';
  color: Color;
};

export type Props = {
  model: Model;
  dispatch: (message: Message) => void;
};

const shapeColor = {
  red: 0,
  green: 0,
  blue: 255
};

export const initialModel = (url) => ({
  url,
  toolbarColor: shapeColor
});

const handleToolbarLineWidthChanged = lineWidth => {

};
const handleToolbarToolChanged = tool => {

};

const handleShapeParametersChanged = shapeParameters => {

};

const ToolbarWrapper = styled.div`
  position: absolute; 
  top: 50px;
  left: 15px;
  transition: transform 0.3s;
`;

const transparent = { red: 0, green: 0, blue: 0, alpha: 0 };

const defaultTool = 'brush';

const lineWidth = 9;

const onLoad = (imageUrl: string, parameters: LoadParameters) => {
  loadParameters = parameters;
  console.log('Editor on LOAD');
} 

const save = () => {
  const image = loadParameters.imageGetter();
  if (image.isExported && image.content) {
    console.log('image received', image);
    alert('this will call the media api to create a new version of the image');
  } else {
    alert('error');
    console.log('image not received', image);
  }
};

export const update = (model: Model, message: Message): Model => {
  switch (message.type) {
    case 'TOOLBAR_COLOR_CHANGE': 
      return {
        ...model,
        toolbarColor: message.color
      };
  }
};

export const Component: React.StatelessComponent<Props> = ({
  model,
  dispatch,
}) => (
  <div>
    <ToolbarWrapper>
      <Toolbar
        color={model.toolbarColor}
        lineWidth={lineWidth}
        tool={defaultTool}
        onColorChanged={(color) => dispatch({ type: 'TOOLBAR_COLOR_CHANGE', color })}
        onLineWidthChanged={handleToolbarLineWidthChanged}
        onToolChanged={handleToolbarToolChanged}
      />
    </ToolbarWrapper>        
    <MediaEditor
      imageUrl={model.url}
      dimensions={{width: 800, height: 600}}
      backgroundColor={transparent}
      shapeParameters={{
        color: model.toolbarColor,
        lineWidth,
        addShadow: true,
      }}
      tool={defaultTool}
      onLoad={onLoad}
      onError={(e) => { console.error(e) }}
      onShapeParametersChanged={handleShapeParametersChanged}
    />
    <button onClick={() => save()}>save</button>
  </div>
);
