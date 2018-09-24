import * as React from 'react';
import ToolbarButton from '../ToolbarButton';
export const ToolbarContext = React.createContext({
  buttonClickCallback: (button: ToolbarButton, delta: number) => null,
  selectedButton: undefined,
});

export interface ToolbarContextValue {
  selectedButton?: React.ReactChild;
  buttonClickCallback: (button: ToolbarButton, delta: number) => null;
}
