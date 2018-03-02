import * as React from 'react';
import { MediaEditor, Toolbar, Color, Dimensions, Tool, LoadParameters } from '@atlaskit/media-editor';
import styled from 'styled-components';

let loadParameters: LoadParameters;

export type Model = {
  url: string;  
};

export type Message = {};

const handleToolbarColorChanged = color => {

};
const handleToolbarLineWidthChanged = lineWidth => {

};
const handleToolbarToolChanged = tool => {

};

const handleShapeParametersChanged = shapeParameters => {

};

export type Props = {
  model: Model;
  dispatch: (message: Message) => void;
};

const ToolbarWrapper = styled.div`
  position: absolute; 
  top: 50px;
  left: 15px;
  transition: transform 0.3s;
`;

const bgColor = {
  red: 0,
  green: 0,
  blue: 0
};

const shapeColor = {
  red: 0,
  green: 0,
  blue: 255
};

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
  } else {
    console.log('image not received', image);
  }
};

export const Editor: React.StatelessComponent<Props> = ({
  model,
  dispatch,
}) => (
  <div>
    <ToolbarWrapper>
      <Toolbar
        color={shapeColor}
        lineWidth={lineWidth}
        tool={defaultTool}
        onColorChanged={handleToolbarColorChanged}
        onLineWidthChanged={handleToolbarLineWidthChanged}
        onToolChanged={handleToolbarToolChanged}
      />
    </ToolbarWrapper>        
    <MediaEditor
      imageUrl={model.url}
      dimensions={{width: 800, height: 600}}
      backgroundColor={bgColor}
      shapeParameters={{
        color: shapeColor,
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
