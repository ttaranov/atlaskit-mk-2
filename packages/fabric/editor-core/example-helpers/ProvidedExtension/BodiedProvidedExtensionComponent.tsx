import * as React from 'react';
import EditorActions from '../../src/editor/actions';
import styled from 'styled-components';
import ExtensionToolbar from './ExtensionToolbar';
import TitleBar from './TitleBar';
import {
  ExtensionToolbarButton,
  ExtensionToolbarSeparator,
} from '../../src/index';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';

const Wrapper = styled.div`
  position: relative;
`;

// tslint:disable-next-line:variable-name
export const Content = styled.div`
  padding: 8px;
  background: white;
  border: ${props => (props.selected ? '1px solid black' : '1px dashed #ccc')};
`;

export type Props = {
  isSelected?: boolean;
  editorActions?: EditorActions;
  node: any;
  onClick?: any;
  onSelect?: any;
  element?: HTMLElement | null;
  handleContentDOMRef?: (node: HTMLElement | null) => void;
};

export default class BodiedProvidedExtensionComponent extends React.Component<
  Props,
  {}
> {
  renderToolbar() {
    const { element } = this.props;

    const popupContainer = document.getElementById('extensionPopupContainer');

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

  renderPreview() {
    return <div>Preview</div>;
  }

  renderBody() {
    const { isSelected, handleContentDOMRef } = this.props;

    return (
      <Content
        selected={isSelected}
        innerRef={handleContentDOMRef}
        className="extension-content"
      />
    );
  }

  render() {
    const { isSelected, node, onClick, onSelect } = this.props;

    const { type } = node;

    return (
      <Wrapper onClick={onClick}>
        {isSelected && this.renderToolbar()}

        <TitleBar onSelect={onSelect} node={node} isSelected={isSelected} />

        {type === 'bodiedExtension' && (
          <div>
            {this.renderPreview()}
            {this.renderBody()}
          </div>
        )}
      </Wrapper>
    );
  }
}
