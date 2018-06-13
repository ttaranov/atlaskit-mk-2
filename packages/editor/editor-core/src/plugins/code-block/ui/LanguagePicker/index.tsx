import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';

import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import Select from '@atlaskit/single-select';

import { CodeBlockState } from '../../pm-plugins/main';
import {
  createLanguageList,
  filterSupportedLanguages,
  findMatchedLanguage,
  getLanguageIdentifier,
  Language,
} from './languageList';
import { TrashToolbarButton, FloatingToolbar } from './styles';

export interface Props {
  editorView: EditorView;
  pluginState: CodeBlockState;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
}

export interface State {
  active?: boolean;
  element?: HTMLElement;
  activeLanguage?: Language;
  supportedLanguages: Language[];
  toolbarVisible: boolean;
  isLanguageSelectOpen?: boolean;
  languageSelectFocused?: boolean;
}

export default class LanguagePicker extends PureComponent<Props, State> {
  items: object[];

  constructor(props) {
    super(props);

    this.state = {
      language: undefined,
      toolbarVisible: false,
      supportedLanguages: filterSupportedLanguages(
        props.pluginState.supportedLanguages,
      ),
    } as State;
  }

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
    const { supportedLanguages } = this.state;

    this.items = [
      {
        items: createLanguageList(supportedLanguages).map(lang => ({
          content: lang.name,
          value: getLanguageIdentifier(lang),
        })),
      },
    ];
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  onLanguageSelectMouseDown = event => {
    event.preventDefault();
    this.setState({
      languageSelectFocused: true,
    });
  };

  resetLanguageSelectFocused = event => {
    this.setState({
      languageSelectFocused: false,
    });
  };

  render() {
    const {
      activeLanguage,
      element,
      toolbarVisible,
      languageSelectFocused,
    } = this.state;

    const defaultLanguage = activeLanguage
      ? {
          content: activeLanguage.name,
          value: getLanguageIdentifier(activeLanguage),
        }
      : undefined;

    if (toolbarVisible || languageSelectFocused) {
      return (
        <FloatingToolbar target={element} offset={[0, 12]}>
          <div
            tabIndex={0}
            onMouseDown={this.onLanguageSelectMouseDown}
            onBlur={this.resetLanguageSelectFocused}
          >
            <Select
              id="test"
              hasAutocomplete={true}
              shouldFocus={languageSelectFocused}
              items={this.items}
              onSelected={this.handleLanguageChange}
              defaultSelected={defaultLanguage}
              placeholder="Select language"
            />
          </div>
          <TrashToolbarButton
            onClick={this.handleRemoveCodeBlock}
            title="Remove code block"
            iconBefore={<RemoveIcon label="Remove code block" />}
          />
        </FloatingToolbar>
      );
    }

    return null;
  }

  private handlePluginStateChange = (pluginState: CodeBlockState) => {
    const { element, language, toolbarVisible } = pluginState;
    const { supportedLanguages } = this.state;

    const updatedLanguage = findMatchedLanguage(supportedLanguages, language);

    this.setState({
      activeLanguage: updatedLanguage,
      element,
      toolbarVisible,
    });

    const activeLanguageValue = updatedLanguage
      ? getLanguageIdentifier(updatedLanguage)
      : undefined;
    if (language !== activeLanguageValue) {
      this.props.pluginState.updateLanguage(
        activeLanguageValue,
        this.props.editorView,
      );
    }
  };

  private handleLanguageChange = (language: any) => {
    this.props.pluginState.updateLanguage(
      language.item.value,
      this.props.editorView,
    );
    this.setState({
      toolbarVisible: true,
    });
  };

  private handleRemoveCodeBlock = () => {
    this.props.pluginState.removeCodeBlock(this.props.editorView);
  };
}
