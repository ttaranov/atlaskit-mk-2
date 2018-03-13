import * as React from 'react';
import MoreIcon from '@atlaskit/icon/glyph/editor/more';
import { Popup } from '@atlaskit/editor-common';
import ToolbarButton from '../../ToolbarButton';
import WithEditorActions from '../../WithEditorActions';
import withOuterListeners from '../../with-outer-listeners';
import EditorActions from '../../../actions';
import { Dropdown, RenderOnClickHandler } from '../';

// tslint:disable-next-line:variable-name
const AddonPopup = withOuterListeners(Popup);

const POPUP_HEIGHT = 188;
const POPUP_WIDTH = 136;

export interface Props {
  dropdownItems?: React.ReactElement<any> | React.ReactElement<any>[];
  isReducedSpacing?: boolean;
}

export interface State {
  isOpen: boolean;
  target?: HTMLElement;
  addonDropdownContent?: React.ReactElement<any> | null;
}

export default class AddonToolbar extends React.Component<Props, State> {
  state: State = {
    isOpen: false,
    addonDropdownContent: null,
  };

  togglePopup = () => {
    this.setState({
      isOpen: !this.state.isOpen,
      addonDropdownContent: null,
    });
  };

  handleDropdownClick = (
    editorActions: EditorActions,
    renderOnClick: RenderOnClickHandler,
  ) => {
    if (renderOnClick) {
      // popup stays open, we just change its content to the component that is returned from renderOnClick()
      this.setState({
        addonDropdownContent: renderOnClick(editorActions, this.togglePopup),
      });
    } else {
      // close popup
      this.togglePopup();
    }
  };

  render() {
    const { dropdownItems, isReducedSpacing } = this.props;
    const { addonDropdownContent, isOpen } = this.state;

    if (
      !dropdownItems ||
      (Array.isArray(dropdownItems) && !dropdownItems.length)
    ) {
      return null;
    }

    return (
      <div ref={this.handleRef}>
        <ToolbarButton
          selected={isOpen}
          spacing={isReducedSpacing ? 'none' : 'default'}
          onClick={this.togglePopup}
          title="Insert addon"
          iconBefore={<MoreIcon label="Insert addon" />}
        />
        {isOpen && (
          <AddonPopup
            handleClickOutside={this.togglePopup}
            handleEscapeKeydown={this.togglePopup}
            target={this.state.target}
            fitHeight={POPUP_HEIGHT}
            fitWidth={POPUP_WIDTH}
            alignY="top"
          >
            <span onClick={this.handlePopupClick}>
              {addonDropdownContent ? (
                addonDropdownContent
              ) : (
                <WithEditorActions
                  // tslint:disable-next-line:jsx-no-lambda
                  render={editorActions => (
                    <Dropdown
                      onClick={this.handleDropdownClick}
                      togglePopup={this.togglePopup}
                      editorActions={editorActions}
                    >
                      {dropdownItems}
                    </Dropdown>
                  )}
                />
              )}
            </span>
          </AddonPopup>
        )}
      </div>
    );
  }

  private handleRef = (target: HTMLDivElement) => {
    this.setState({ target });
  };

  // cancel bubbling to fix clickOutside logic:
  // popup re-renders its content before the click event bubbles up to the document
  // therefore click target element would be different from the popup content
  private handlePopupClick = event =>
    event.nativeEvent.stopImmediatePropagation();
}
