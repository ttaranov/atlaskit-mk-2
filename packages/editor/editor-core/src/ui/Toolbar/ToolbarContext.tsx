import * as React from 'react';

export const ToolbarContext = React.createContext({
  registerButton: (button: any) => null,
  selectedButton: undefined,
  selectedButtonIndex: 0,
  enabled: false,
  shouldFocus: () => false,
} as ToolbarContextInterface);

export type ToolbarContextInterface = {
  registerButton: (button: any) => null;
  selectedButton: any;
  selectedButtonIndex: number;
  enabled: boolean;
  shouldFocus?: () => boolean;
};
