import * as React from 'react';
import Select from '@atlaskit/single-select';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import Separator from '../../../../ui/Separator';
import { TrashToolbarButton, FloatingToolbar } from './styles';
import {
  createLanguageList,
  DEFAULT_LANGUAGES,
  getLanguageIdentifier,
} from '@atlaskit/editor-common';

const LANGUAGE_LIST_ITEMS = createLanguageList(DEFAULT_LANGUAGES).map(lang => ({
  content: lang.name,
  value: getLanguageIdentifier(lang),
}));

const AK_LANGUAGE_LIST_ITEMS = [{ items: LANGUAGE_LIST_ITEMS }];

export interface Props {
  activeCodeBlockDOM: HTMLElement;
  activeLanguage?: string;
  setLanguage: (language: string) => void;
  deleteCodeBlock: () => void;
  innerRef?: (node?: HTMLElement) => void;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}

export class LanguagePicker extends React.Component<Props> {
  handleLanguageSelected = ({ item }) => {
    this.props.setLanguage(item.value);
  };

  handleCodeBlockDelete = () => {
    this.props.deleteCodeBlock();
  };

  shouldComponentUpdate(nextProps: Props) {
    if (nextProps.activeLanguage !== this.props.activeLanguage) {
      return true;
    }
    if (nextProps.activeCodeBlockDOM !== this.props.activeCodeBlockDOM) {
      return true;
    }
    return false;
  }

  render() {
    const {
      innerRef,
      popupsMountPoint,
      popupsBoundariesElement,
      activeCodeBlockDOM,
      activeLanguage,
    } = this.props;

    const defaultLanguage = LANGUAGE_LIST_ITEMS.find(
      lang => lang.value === activeLanguage,
    );

    return (
      <FloatingToolbar
        innerRef={innerRef}
        target={activeCodeBlockDOM}
        offset={[0, 12]}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
      >
        <Select
          hasAutocomplete={true}
          items={AK_LANGUAGE_LIST_ITEMS}
          defaultSelected={defaultLanguage}
          onSelected={this.handleLanguageSelected}
          placeholder="Select language"
        />
        <Separator />
        <TrashToolbarButton
          onClick={this.handleCodeBlockDelete}
          title="Remove code block"
          iconBefore={<RemoveIcon label="Remove code block" />}
        />
      </FloatingToolbar>
    );
  }
}

export default class LanguagePickerWithOutsideListeners extends React.Component<
  Props & { isEditorFocused: boolean },
  { isToolbarFocused: boolean }
> {
  state = { isToolbarFocused: false };
  toolbar?: HTMLElement;

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick);
  }

  setToolbarRef = (node?: HTMLElement) => {
    this.toolbar = node;
  };

  handleClick = (event: MouseEvent) => {
    const wasToolbarClicked =
      !!this.toolbar && this.toolbar.contains(event.target as Node);
    if (wasToolbarClicked !== this.state.isToolbarFocused) {
      this.setState({ isToolbarFocused: wasToolbarClicked });
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    const didShowPicker =
      this.props.isEditorFocused || this.state.isToolbarFocused;
    const shouldShowPicker =
      nextProps.isEditorFocused || nextState.isToolbarFocused;
    return didShowPicker !== shouldShowPicker;
  }

  render() {
    const { isEditorFocused, ...rest } = this.props;
    if (isEditorFocused || this.state.isToolbarFocused) {
      return <LanguagePicker {...rest} innerRef={this.setToolbarRef} />;
    }
    return null;
  }
}
