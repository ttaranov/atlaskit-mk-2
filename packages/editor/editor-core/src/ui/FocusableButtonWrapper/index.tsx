// import * as React from 'react';
// import { PureComponent, ReactElement } from 'react';
// import { AkButton } from './styles';

// import ToolbarContext from '../Toolbar/ToolbarContext';

// export interface Props {
//   focus?: () => null;

//   className?: string;
//   disabled?: boolean;
//   // hideTooltip?: boolean;
//   href?: string;
//   iconAfter?: ReactElement<any>;
//   iconBefore?: ReactElement<any>;
//   onClick?: (event: Event) => void;
//   selected?: boolean;
//   spacing?: 'default' | 'compact' | 'none';
//   target?: string;
//   theme?: 'dark';
//   // title?: string;
//   // titlePosition?: string;
//   onFocus?: (event: Event) => void;

//   isDisabled?: boolean;

//   navigateLeft?: () => void;
//   navigateRight?: () => void;
// }

// export default class FocusableButtonWrapper extends PureComponent<
//   Props,
//   { textInput }
// > {
//   constructor(props) {
//     super(props);
//     // this.onToggleLoop = this.onToggleLoop.bind(this);
//   }

//   render() {
//     const button = (
//       <AkButton
//         tabIndex="-1"
//         appearance="subtle"
//         ariaHaspopup={true}
//         className={this.props.className}
//         href={this.props.href}
//         iconAfter={this.props.iconAfter}
//         iconBefore={this.props.iconBefore}
//         isDisabled={this.props.disabled}
//         isSelected={this.props.selected}
//         onClick={this.props.onClick}
//         spacing={this.props.spacing || 'default'}
//         target={this.props.target}
//         theme={this.props.theme}
//         shouldFitContainer={true}
//         onFocus={this.props.onFocus}
//       >
//         {this.props.children}
//       </AkButton>
//     );

//     const { onClick, navigateLeft, navigateRight } = this.props;
//     return (
//       <ToolbarContext.Consumer>
//         {value => (
//           <div
//             tabIndex={0}
//             // onClick={e => console.log('AYYEEE', e)}
//             onKeyDown={this.handleKeydown({
//               onClick,
//               toolbarCallback: value.buttonClickCallback,
//             })}
//           >
//             {button}
//           </div>
//         )}
//       </ToolbarContext.Consumer>
//     );
//   }
//   private handleKeydown = callbacks => e => {
//     const { onClick, toolbarCallback } = callbacks;

//     if (e.keyCode === 13 && onClick) {
//       onClick(e);
//     } else if (e.keyCode === 37) {
//       // left arrow
//       // navigateLeft(e);
//     } else if (e.keyCode === 39) {
//       // right arrow
//       console.log('navigating right in button wrapper');
//       toolbarCallback(this);

//       // navigateRight(e);
//     }
//   };
// }
