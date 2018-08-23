import * as React from 'react';
import { ExtensionEditorContainer } from './styles';
import FieldText from '@atlaskit/field-text';
import { FormWrapper } from './styles';
import * as ReactDOM from 'react-dom';
import NativeListener from 'react-native-listener';
import { setNodeSelection } from '../utils';
import { resolveMacro } from '../plugins/macro/actions';
import { replaceSelectedNode } from 'prosemirror-utils';
import Button from '@atlaskit/button';

import Form, {
  Field,
  FormHeader,
  FormSection,
  FormFooter,
} from '@atlaskit/form';

export interface Props {
  showSidebar: boolean;
  node: Object;
}

export interface State {
  showSidebar: boolean;
  node: Object;
  params: Object;
  nodePos: number;
}

export class ExtensionEditor extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    const { showSidebar, node, nodePos } = props;

    this.state = {
      ...props,
      nodePos: props.node && props.node.pos,
      params: props.node && props.node.node.attrs.parameters,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.showSidebar !== nextProps.showSidebar ||
      this.props.node !== nextProps.node
    ) {
      this.setState((prev, next) => {
        return {
          showSidebar: nextProps.showSidebar,
          node: nextProps.node && nextProps.node.node,
          params:
            (prev.node && prev.params) ||
            (nextProps.node && nextProps.node.node.attrs.parameters),
          nodePos: nextProps.node && nextProps.node.pos,
        };
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return true;
    if (
      this.props.node !== nextProps.node ||
      this.props.showSidebar !== nextProps.showSidebar ||
      this.props.params !== nextProps.params
    ) {
      return true;
    }
    return false;
  }

  saveExtension = () => {
    // let {tr} = this.props.view.state;
    // tr = replaceSelectedNode(node)(tr);
    const { dispatch, state } = this.props.view;
    const { node } = this.props.node;

    const newNode = resolveMacro(
      {
        type: node.type.name,
        attrs: {
          ...node.attrs,
          parameters: this.state.params,
        },
      } as any,
      this.props.view.state,
    );

    console.log(newNode);
    dispatch(replaceSelectedNode(newNode)(state.tr));
  };

  renderChoices(params) {
    return this.state.params.choices.map((item, idx) => {
      return (
        <Field id={item.id} label={`Option ${idx + 1}`} isRequired>
          <FieldText
            name="ext_name"
            onChange={this.updateInput.bind(null, item.id)}
            shouldFitContainer
            value={item.value}
            onBlur={this.saveExtension}
          />
        </Field>
      );
    });
  }

  addOption = e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(
      {
        params: {
          ...this.state.params,
          choices: [...this.state.params.choices, []],
        },
      },
      () => {
        setNodeSelection(this.props.view, this.state.nodePos);
      },
    );
  };

  preventDefault(e) {
    if (!(e.target.classList.contains('react') || e.target.closest('.react'))) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  updateInput = (key, e) => {
    e.persist();
    this.setState(prev => ({
      params: {
        ...prev.params,
        choices: prev.params.choices.map((item, idx) => {
          if (item.id === key) {
            return {
              id: item.id,
              value: e.target.value,
            };
          }
          return item;
        }),
      },
    }));
  };

  renderForm(node) {
    const { extensionKey, parameters } = node.attrs;
    return (
      <FormWrapper>
        <Form
          name="edit-extension"
          target="submitEdit"
          onSubmit={this.saveExtension}
        >
          <FormHeader title={extensionKey} />
          <Field label="Description" isRequired>
            <FieldText
              name="ext_name"
              shouldFitContainer
              value={parameters.title}
            />
          </Field>
          <div className="options">{this.renderChoices(parameters)}</div>
          <div>
            <span className="add-option">
              <a className="react" onClick={this.addOption}>
                {' '}
                + Add option{' '}
              </a>
            </span>
          </div>
          <Button
            className="react"
            type="submit"
            appearance="primary"
            onClick={this.saveExtension}
          >
            Save
          </Button>
        </Form>
      </FormWrapper>
    );
  }

  render() {
    const { showSidebar, node } = this.state;
    if (!showSidebar || !node) {
      return null;
    }

    return ReactDOM.createPortal(
      <NativeListener onClick={this.preventDefault.bind(this)}>
        <ExtensionEditorContainer>
          <h1>Extension Editor </h1>
          {this.renderForm(node)}
        </ExtensionEditorContainer>
      </NativeListener>,
      document.body,
    );
  }
}
