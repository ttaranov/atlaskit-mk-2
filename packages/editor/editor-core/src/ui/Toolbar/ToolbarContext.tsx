import * as React from 'react';

export const ToolbarContext = React.createContext({
  registerButton: (button: any) => null,
  selectedButton: undefined,
  selectedButtonIndex: 0,
  enabled: false,
  // arrowKeyPushed: false,
  // handleArrowKeyPushed: () => null,
  shouldFocus: () => false,
});

export interface ToolbarContextInterface {
  registerButton: (button: any) => null;
  selectedButton: any;
  selectedButtonIndex: number;
  enabled: boolean;
  // arrowKeyPushed: boolean;
  // handleArrowKeyPushed: () => null;
  shouldFocus: () => boolean;
}
