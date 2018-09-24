import * as React from 'react';
export const ToolbarContext = React.createContext({
  buttonClickCallback: (button: any, delta: number) => null,
  selectedButton: undefined,
});

export interface ToolbarContextValue {
  selectedButton?: React.ReactChild;
  buttonClickCallback: (button: any, delta: number) => null;
}
