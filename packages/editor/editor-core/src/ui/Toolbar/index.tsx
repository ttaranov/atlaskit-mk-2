import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import SizeDetector from '@atlaskit/size-detector';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorAppearance, ToolbarUIComponentFactory } from '../../types';
import { EventDispatcher } from '../../event-dispatcher';
import EditorActions from '../../actions';

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
  selectedItemIdx: number;
  navigationDirection: 1 | 2;
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
        navigationDirection: 1,
      };
    }
  }

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

  private handleKeyDown = e => {
    if (
      typeof this.state.selectedItemIdx === 'undefined' ||
      !this.props.items
    ) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      const newSelectedItemIdx =
        this.state.selectedItemIdx === 0
          ? this.props.items.length - 1
          : this.state.selectedItemIdx - 1;
      console.log('TOOLBAR: New selected index:', newSelectedItemIdx);
      this.setState({
        selectedItemIdx: newSelectedItemIdx,
        navigationDirection: 1,
      });
    } else if (e.key === 'ArrowRight') {
      const newSelectedItemIdx =
        this.state.selectedItemIdx === this.props.items.length - 1
          ? 0
          : this.state.selectedItemIdx + 1;
      console.log('TOOLBAR: New selected index:', newSelectedItemIdx);
      this.setState({
        selectedItemIdx: newSelectedItemIdx,
        navigationDirection: 2,
      });
      return true;
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
            const focused =
              this.state.selectedItemIdx === key
                ? this.state.navigationDirection
                : undefined;
            const props = { key, focused };
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
              focused,
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
