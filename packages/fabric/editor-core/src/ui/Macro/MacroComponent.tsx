import * as React from 'react';
import { Component } from 'react';
import { MacroProvider } from '../../editor/plugins/macro/types';
import { EditorView } from 'prosemirror-view';
import withOuterListeners from '../with-outer-listeners';
import { Container, Overlay } from './styles';

// tslint:disable-next-line:variable-name
const ContainerWithOuterListeners = withOuterListeners(Container);

export interface Props {
  macroProvider?: Promise<MacroProvider>;
  macroId: string;
  placeholderUrl: string;
  view: EditorView;
  setMacroElement: (view: EditorView, macroElement: HTMLElement | null) => void;
}

export interface State {
  macroProvider?: MacroProvider;
}

export default class MacroComponent extends Component<Props, State> {
  state: State = {};

  constructor(props: Props) {
    super(props);
  }

  componentWillMount() {
    const { macroProvider } = this.props;

    if (macroProvider) {
      macroProvider.then(this.handleMacroProvider);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { macroProvider } = nextProps;

    if (this.props.macroProvider !== macroProvider) {
      if (macroProvider) {
        macroProvider.then(this.handleMacroProvider);
      } else {
        this.setState({ macroProvider });
      }
    }
  }

  handleClickOutside = () => {
    this.props.setMacroElement(this.props.view, null);
  }

  render() {
    const { macroProvider } = this.state;
    const { macroId, placeholderUrl } = this.props;

    return (
      <ContainerWithOuterListeners
        data-macro-id={macroId}
        onClick={this.handleClick}
        handleClickOutside={this.handleClickOutside}
      >
        <Overlay />
        {macroProvider && <img src={`${macroProvider.config.placeholderBaseUrl}${placeholderUrl}`} />}
      </ContainerWithOuterListeners>
    );
  }

  private handleMacroProvider = (macroProvider: MacroProvider) => {
    this.setState({ macroProvider });
  }

  private handleClick = (event: React.SyntheticEvent<any>) => {
    this.props.setMacroElement(this.props.view, event.currentTarget);
  }
}
