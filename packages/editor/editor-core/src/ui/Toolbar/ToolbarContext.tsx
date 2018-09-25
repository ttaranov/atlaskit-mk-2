import * as React from 'react';
// import ToolbarButton from '../ToolbarButton';

const ToolbarContext = React.createContext({
  registerButton: (button: any) => null,
  selectedButton: null,
  selectedButtonIndex: 1,
});

export default ToolbarContext;

// export interface ToolbarContextValue {
//   selectedButton?: React.ReactChild;
//   buttonClickCallback: (button: any, delta: number) => null;
// }
