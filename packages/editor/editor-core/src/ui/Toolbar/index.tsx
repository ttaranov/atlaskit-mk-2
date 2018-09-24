import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import SizeDetector from '@atlaskit/size-detector';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorAppearance, ToolbarUIComponentFactory } from '../../types';
import { EventDispatcher } from '../../event-dispatcher';
import EditorActions from '../../actions';
// import ToolbarContext from './ToolbarContext';

const ToolbarComponentsWrapper = styled.div`
  display: flex;
`;

// const { Consumer, Provider } = createContext({
//   test: "hello",
// });

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

export interface ToolbarInnerProps extends ToolbarProps {
  toolbarSize: ToolbarSize;
  isToolbarReducedSpacing: boolean;
}

export class ToolbarInner extends React.Component<ToolbarInnerProps> {
  shouldComponentUpdate(nextProps, nextState) {
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

    let lastItem = undefined;

    // const buttonClicked = button => {
    //   const buttonProps = button.props;
    //   const allButtonProps = items.map(item => item.props);

    //   console.log('Provider button clicked, it is ', button);
    //   console.log('button index in items is ', items.indexOf(button));
    //   console.log(
    //     'button props index in items (props) is ',
    //     allButtonProps.indexOf(buttonProps),
    //   );
    //   console.log('items is ', items);
    //   console.log('item 0 is', items[0]);
    // };
    return (
      <ToolbarComponentsWrapper>
        {/* <ToolbarContext.Provider
          value={{
            buttonClickCallback: buttonClicked,
            currentlySelected: null,
          }}
        > */}
        {items.map((component, key) => {
          const navigateRight = () => {
            const itemToFocus = key + 1;
            console.log(`navigated right in TOOLBAR!, key ${key}`);
            if (itemToFocus > 0 && itemToFocus < items.length) {
              // items[itemToFocus].focus();
            }
          };

          const props: any = { key };
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
            navigateRight,
            toolbarSize,
            isToolbarReducedSpacing,
            onFocus: e => console.log('test', e),
          });
          return element && React.cloneElement(element, props);
        })}
        {/* </ToolbarContext.Provider> */}
      </ToolbarComponentsWrapper>
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
