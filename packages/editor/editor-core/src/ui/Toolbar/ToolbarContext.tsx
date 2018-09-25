import * as React from 'react';
// import ToolbarButton from '../ToolbarButton';

const ToolbarContext = React.createContext({
  registerButton: (button: any) => null,
  selectedButton: null,
});

export default ToolbarContext;

// export interface ToolbarContextValue {
//   selectedButton?: React.ReactChild;
//   buttonClickCallback: (button: any, delta: number) => null;
// }
