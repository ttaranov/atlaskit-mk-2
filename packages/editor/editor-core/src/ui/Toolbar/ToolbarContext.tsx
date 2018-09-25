import * as React from 'react';
// import ToolbarButton from '../ToolbarButton';

export const ToolbarContext = React.createContext({
  registerButton: (button: any) => null,
  selectedButton: null,
  selectedButtonIndex: 0,
});

export interface ToolbarContextInterface {
  registerButton: (button: any) => null;
  selectedButton: any;
  selectedButtonIndex: number;
}
