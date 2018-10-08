import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import SizeDetector from '@atlaskit/size-detector';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorAppearance, ToolbarUIComponentFactory } from '../../types';
import { EventDispatcher } from '../../event-dispatcher';
import EditorActions from '../../actions';
import { ToolbarContext } from './ToolbarContext';

const ToolbarComponentsWrapper = styled.div`
  display: flex;
`;

export enum ToolbarSize {
  XXL = 6,
  XL = 5,
  L = 4,
  M = 3,
  S = 2,
  XXXS = 1,
}

// Toolbar sizes for full page editor a little bit different, because it has more buttons e.g. actions button...
const toolbarSizesFullPage: Array<{ width: number; size: ToolbarSize }> = [
  { width: 650, size: ToolbarSize.XXL },
  { width: 580, size: ToolbarSize.XL },
  { width: 500, size: ToolbarSize.L },
  { width: 450, size: ToolbarSize.M },
  { width: 370, size: ToolbarSize.S },
];

const toolbarSizes: Array<{ width: number; size: ToolbarSize }> = [
  { width: 610, size: ToolbarSize.XXL },
  { width: 540, size: ToolbarSize.XL },
  { width: 460, size: ToolbarSize.L },
  { width: 450, size: ToolbarSize.M },
  { width: 370, size: ToolbarSize.S },
];

export interface ToolbarProps {
  items?: Array<ToolbarUIComponentFactory>;
  editorView: EditorView;
  editorActions?: EditorActions;
  eventDispatcher: EventDispatcher;
  providerFactory: ProviderFactory;
  appearance: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  disabled: boolean;
  width?: number;
}

interface ToolbarInnerState {
  selectedItemIdx?: number;
}

export interface ToolbarInnerProps extends ToolbarProps {
  toolbarSize: ToolbarSize;
  isToolbarReducedSpacing: boolean;
}

export class ToolbarInner extends React.Component<
  ToolbarInnerProps,
  ToolbarInnerState
> {
  constructor(props: ToolbarInnerProps) {
    super(props);

    if (props.items) {
      this.state = {
        selectedItemIdx: 0,
      };
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if (this.props.disabled === true && nextProps.disabled === false) {
    //   this.updateSelectedButton();
    // }

    return (
      nextProps.toolbarSize !== this.props.toolbarSize ||
      nextProps.disabled !== this.props.disabled ||
      nextProps.popupsMountPoint === this.props.popupsMountPoint ||
      nextProps.popupsBoundariesElement ===
        this.props.popupsBoundariesElement ||
      nextProps.popupsScrollableElement ===
        this.props.popupsScrollableElement ||
      nextProps.isReducedSpacing !== this.props.isToolbarReducedSpacing
    );
  }
  // shouldFocus = () => {
  //   const pushed: boolean = this.state.arrowKeyPushed;
  //   if (pushed) {
  //     this.setState({
  //       arrowKeyPushed: false,
  //     });
  //   }
  //   return pushed;
  // };

  // registerButton = button => {
  //   this.setState(prevState => {
  //     const prevRegisteredButtons = prevState.registeredButtons;

  //     if (prevRegisteredButtons.find(this.equalsButton(button))) {
  //       console.log('Button ' + button.props.title + ' already exists.');
  //       // Our button already exists
  //       return { ...prevState };
  //     } else {
  //       console.log('Button ' + button.props.title + ' DOESNT exist.');
  //     }

  //     const newRegisteredButtons = [...prevRegisteredButtons, button];
  //     // Ensure selectedButton if defined if there are any buttons registered
  //     let selectedButton =
  //       newRegisteredButtons.length > 0
  //         ? newRegisteredButtons[prevState.selectedButtonIndex]
  //         : prevState.selectedButton;
  //     return {
  //       registeredButtons: newRegisteredButtons,
  //       selectedButton: selectedButton,
  //     };
  //   });
  //   return null;
  // };

  // private changeSelectedButton(delta: number) {
  //   this.setState(prevState => {
  //     const newIndex = prevState.selectedButtonIndex + delta;
  //     const buttons = prevState.registeredButtons;

  //     // Stay in the toolbar boundaries
  //     if (newIndex < 0 || newIndex >= buttons.length) {
  //       return { ...prevState };
  //     }
  //     // console.log("Selected button is now ", buttons[newIndex])
  //     console.log('Selected button is now ', buttons[newIndex].props.title);

  //     return {
  //       selectedButtonIndex: newIndex,
  //       selectedButton: buttons[newIndex],
  //       arrowKeyPushed: true,
  //     };
  //   });
  // }

  private handleKeyDown = e => {
    if (
      typeof this.state.selectedItemIdx === 'undefined' ||
      !this.props.items
    ) {
      return;
    }

    console.log(
      'keydown',
      e.key,
      'currently selected',
      this.state.selectedItemIdx,
    );

    if (e.key === 'ArrowLeft') {
      this.setState({
        selectedItemIdx:
          this.state.selectedItemIdx === 0
            ? this.props.items.length - 1
            : this.state.selectedItemIdx - 1,
      });
    } else if (e.key === 'ArrowRight') {
      this.setState({
        selectedItemIdx:
          this.state.selectedItemIdx === this.props.items.length - 1
            ? 0
            : this.state.selectedItemIdx + 1,
      });
    }
  };

  render() {
    const {
      appearance,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      items,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      toolbarSize,
      disabled,
      isToolbarReducedSpacing,
    } = this.props;

    if (!items || !items.length) {
      return null;
    }

    return (
      <div onKeyDown={this.handleKeyDown}>
        <ToolbarComponentsWrapper>
          {items.map((component, key) => {
            const props = { key, focused: this.state.selectedItemIdx === key };
            const element = component({
              editorView,
              editorActions: editorActions as EditorActions,
              eventDispatcher,
              providerFactory,
              appearance,
              popupsMountPoint,
              popupsBoundariesElement,
              popupsScrollableElement,
              disabled,
              toolbarSize,
              isToolbarReducedSpacing,
              containerElement: undefined,
              focused: this.state.selectedItemIdx === key,
            });

            return element && React.cloneElement(element, props);
          })}
        </ToolbarComponentsWrapper>
      </div>
    );
  }
}

const toolbarSizesForAppearance = (appearance?: string) =>
  appearance === 'full-page' ? toolbarSizesFullPage : toolbarSizes;

const widthToToolbarSize = (toolbarWidth: number, appearance?: string) => {
  return (
    toolbarSizesForAppearance(appearance).find(
      ({ width }) => toolbarWidth > width,
    ) || {
      size: ToolbarSize.XXXS,
    }
  ).size;
};

export function Toolbar(props: ToolbarProps) {
  const toolbarSize = widthToToolbarSize(props.width || 0, props.appearance);
  return (
    <ToolbarInner
      {...props}
      toolbarSize={toolbarSize}
      isToolbarReducedSpacing={toolbarSize < ToolbarSize.XXL}
    />
  );
}

export default function ToolbarWithSizeDetector(props: ToolbarProps) {
  return (
    <div style={{ width: '100%', minWidth: '254px' }}>
      <SizeDetector>
        {({ width }) => <Toolbar {...props} width={width} />}
      </SizeDetector>
    </div>
  );
}
