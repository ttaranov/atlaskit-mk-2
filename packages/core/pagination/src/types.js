//@flow
import type { Node } from 'react';
import type { ButtonProps } from '@atlaskit/button';

export type LinkPropsType = {
  /** React node to render in the button, pass the text you want use to view on pagination button */
  children: Node,
  /** If the pagination button needs an href, it will be passed down to button */
  href?: string,
  /** This will be passed in as ariaLabel to button. This is what screen reader will read */
  ariaLabel?: string,
  /** This function is called with the label as argument when user clicks on particular button */
  onClick: Function,
  /** Pass this prop as true to signify that this is the current page */
  isSelected?: boolean,
};

export type NavigatorPropsType = {
  /** React node to render in the button, pass the text you want use to view on pagination button */
  children?: Node,
  /** Is the navigator disabled */
  isDisabled?: boolean,
  /** This function is called with the when user clicks on navigator */
  onClick?: Function,
  /** This will be passed in as ariaLabel to button. This is what screen reader will read */
  ariaLabel?: string,
};

export type PagePropsType = $Diff<
  ButtonProps,
  {
    appearance: any,
    spacing: any,
    shouldFitContainer: any,
  },
>;
