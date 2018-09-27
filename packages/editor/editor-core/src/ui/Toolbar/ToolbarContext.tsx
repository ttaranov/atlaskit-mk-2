import * as React from 'react';

export const ToolbarContext = React.createContext({
  registerButton: (button: React.ReactNode) => null,
  selectedButton: undefined,
  selectedButtonIndex: 0,
  enabled: false,
  shouldFocus: () => false,
} as ToolbarContextInterface);

export type ToolbarContextInterface = {
  registerButton: (button: React.ReactNode) => null;
  selectedButton: React.ReactNode;
  selectedButtonIndex: number;
  enabled: boolean;
  shouldFocus?: () => boolean;
};
