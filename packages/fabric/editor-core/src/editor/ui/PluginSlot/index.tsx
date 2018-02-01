import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorAppearance } from '../../types';
import { EventDispatcher } from '../../event-dispatcher';

const PluginsComponentsWrapper = styled.div`
  display: flex;
`;

export interface Props {
  items?: any[];
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
  providerFactory: ProviderFactory;
  appearance: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  disabled: boolean;
}

export default class PluginSlot extends React.Component<Props, any> {
  shouldComponentUpdate(nextProps: Props) {
    const {
      editorView,
      items,
      providerFactory,
      eventDispatcher,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      disabled,
    } = this.props;
    return !(
      nextProps.editorView === editorView &&
      nextProps.items === items &&
      nextProps.providerFactory === providerFactory &&
      nextProps.eventDispatcher === eventDispatcher &&
      nextProps.popupsMountPoint === popupsMountPoint &&
      nextProps.popupsBoundariesElement === popupsBoundariesElement &&
      nextProps.popupsScrollableElement === popupsScrollableElement &&
      nextProps.disabled === disabled
    );
  }

  render() {
    const {
      items,
      editorView,
      eventDispatcher,
      providerFactory,
      appearance,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      disabled,
    } = this.props;

    if (!items) {
      return null;
    }

    return (
      <PluginsComponentsWrapper>
        {items.map((component, key) => {
          const props: any = { key };
          const element = component({
            editorView,
            eventDispatcher,
            providerFactory,
            appearance,
            popupsMountPoint,
            popupsBoundariesElement,
            popupsScrollableElement,
            disabled,
          });
          return element && React.cloneElement(element, props);
        })}
      </PluginsComponentsWrapper>
    );
  }
}
