import * as React from 'react';
import EditorActions from '../../src/editor/actions';
import styled from 'styled-components';
import TitleBar from './TitleBar';

import {
  ExtensionToolbar,
  ExtensionToolbarButton,
  ExtensionToolbarSeparator,
} from '../../src/index';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';

export type Props = {
  isSelected?: boolean;
  editorActions?: EditorActions;
  node: any;
  onClick?: any;
  onSelect?: any;
  element: HTMLElement;
  handleContentDOMRef?: (node: HTMLElement | null) => void;
};

const Wrapper = styled.div`
  position: relative;
`;

const Content = styled.div`
  padding: 8px;
  background: white;
`;

export default class BodiedProvidedExtensionComponent extends React.Component<
  Props,
  {}
> {
  renderToolbar() {
    const { element } = this.props;

    const popupContainer = document.getElementById('extensionPopupContainer');

    if (!popupContainer) {
      return null;
    }

    return (
      <ExtensionToolbar element={element} popupContainer={popupContainer}>
        <ExtensionToolbarButton
          onClick={() => {}}
          iconBefore={<EditIcon label="Edit extension" />}
        />
        <ExtensionToolbarSeparator />
        <ExtensionToolbarButton
          onClick={() => {}}
          iconBefore={<RemoveIcon label="Remove extension" />}
        />
      </ExtensionToolbar>
    );
  }

  renderBody() {
    const { isSelected, handleContentDOMRef } = this.props;
    return (
      <Content
        innerRef={handleContentDOMRef}
        className="extension-content"
        style={{ border: isSelected ? '1px solid black' : '1px dashed #ccc' }}
      />
    );
  }

  render() {
    const { isSelected, node, onClick, onSelect } = this.props;

    const { type } = node;

    return (
      <Wrapper onClick={onClick}>
        <TitleBar onSelect={onSelect} node={node} isSelected={isSelected} />
        {isSelected && this.renderToolbar()}
        {type === 'bodiedExtension' && <div>{this.renderBody()}</div>}
      </Wrapper>
    );
  }
}
