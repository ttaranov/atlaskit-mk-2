// tslint:disable:no-console

import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';

import {
  tableBackgroundColorPalette,
  tableBackgroundBorderColors,
} from '@atlaskit/editor-common';
import BackgroundColorIcon from '@atlaskit/icon/glyph/editor/background-color';
import TableDisplayOptionsIcon from '@atlaskit/icon/glyph/editor/table-display-options';

import Toolbar from '../src/plugins/floating-toolbar/ui/Toolbar';
import ColorPalette from '../src/ui/ColorPalette';
// import ToolsDrawer from '../example-helpers/ToolsDrawer';

const SAVE_ACTION = () => console.log('Save');
// const analyticsHandler = (actionName, props) => console.log(actionName, props);

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80vh;
`;

const ColorPaletteContainer = styled.div`
  width: 144px;
`;

export default class Example extends Component {
  ref?: HTMLElement;

  render() {
    return (
      <Container>
        <Toolbar
          ariaLabel="Test Toolbar"
          items={[
            {
              type: 'button',
              icon: BackgroundColorIcon,
              onClick: () => {},
              title: 'Do Something',
            },
            {
              type: 'dropdown',
              title: 'Toggle background color menu',
              icon: BackgroundColorIcon,
              hidden: true,
              options: ({ hide }) => (
                <ColorPaletteContainer>
                  <ColorPalette
                    palette={tableBackgroundColorPalette}
                    borderColors={tableBackgroundBorderColors}
                    onClick={() => {
                      SAVE_ACTION();
                      hide();
                    }}
                  />
                </ColorPaletteContainer>
              ),
            },
            {
              type: 'dropdown',
              title: 'Toggle display options menu',
              icon: TableDisplayOptionsIcon,
              options: [
                {
                  title: 'Header row',
                  selected: false,
                  onClick: () => {},
                },
                {
                  title: 'Header column',
                  selected: true,
                  onClick: () => {},
                },
                {
                  title: 'Number column',
                  selected: false,
                  onClick: () => {},
                },
              ],
            },
          ]}
          dispatchCommand={() => SAVE_ACTION}
        />
      </Container>
    );
  }
}
