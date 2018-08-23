import * as React from 'react';
import { ExtensionEditorContainer } from './styles';
import FieldText from '@atlaskit/field-text';
import { FormWrapper } from './styles';
import { setNodeSelection } from '../utils';
import { resolveMacro } from '../plugins/macro/actions';
import { replaceSelectedNode } from 'prosemirror-utils';
import Button from '@atlaskit/button';
import { generateUuid } from '@atlaskit/editor-common';
import { pluginKey } from '../plugins/extension/plugin';
import Form, { Field, FormHeader } from '@atlaskit/form';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';

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

export class Poll extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      ...props,
      nodePos: props.node && props.node.pos,
      params: props.node && props.node.node.attrs.parameters,
    };
  }

  componentDidUpdate(nextProps) {
    if (this.props.node.node !== nextProps.node.node) {
      this.setState((prev, next) => {
        return {
          node:
            nextProps.node && nextProps.node.node ? nextProps.node.node : null,
          params:
            (prev.node && prev.params) ||
            (nextProps.node && nextProps.node.node.attrs.parameters),
          nodePos: nextProps.node && nextProps.node.pos,
        };
      });
    }
  }

  saveExtension = () => {
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
    dispatch(
      replaceSelectedNode(newNode)(state.tr).setMeta(pluginKey, {
        showSidebar: false,
      }),
    );
  };

  removeItem = id => {
    console.log('removing');

    this.setState(
      {
        params: {
          ...this.state.params,
          choices: this.state.params.choices.filter(
            (item, idx) => item.id !== id,
          ),
        },
      },
      () => {
        setNodeSelection(this.props.view, this.state.nodePos);
      },
    );
  };

  renderChoices(params) {
    return this.state.params.choices.map((item, idx) => {
      return (
        <>
          <Field id={item.id} label={`Option ${idx + 1}`} isRequired>
            <FieldText
              name="ext_name"
              onChange={this.updateInput.bind(null, item.id)}
              onBlur={this.saveExtension}
              value={item.value}
              shouldFitContainer
            />
          </Field>
          {idx > 1 && (
            <Button
              className="react remove-option"
              appearance="link"
              onClick={this.removeItem.bind(null, item.id)}
            >
              Remove
            </Button>
          )}
        </>
      );
    });
  }

  addOption = e => {
    const { params } = this.state;

    this.setState(
      {
        params: {
          ...params,
          choices: [
            ...params.choices,
            {
              id: `${generateUuid()}`,
              value: '',
            },
          ],
        },
      },
      () => {
        setNodeSelection(this.props.view, this.state.nodePos);
      },
    );
  };

  updateInput = (key, e) => {
    e.persist();
    const { params } = this.state;
    const nextState = {
      params: {
        ...params,
        choices: params.choices.map((item, idx) => {
          if (item.id === key) {
            return {
              id: item.id,
              value: e.target.value,
            };
          }
          return item;
        }),
      },
    };
    this.setState(nextState);
  };

  updateTitle = e => {
    e.persist();

    this.setState(prev => ({
      params: {
        ...prev.params,
        title: e.target.value,
      },
    }));
  };

  renderForm(node) {
    if (!node) {
      return;
    }
    const { extensionKey, parameters } = node.node && node.node.attrs;
    return (
      <FormWrapper>
        <Form name="edit-extension" target="submitEdit">
          <FormHeader title={extensionKey} />
          <Field label="Description" isRequired>
            <FieldText
              name="ext_name"
              shouldFitContainer
              value={parameters.title}
              onChange={this.updateTitle}
            />
          </Field>
          <div className="options">{this.renderChoices(parameters)}</div>
          <div>
            <span className="add-option">
              <Button
                className="react"
                appearance="link"
                onClick={this.addOption}
              >
                + Add option
              </Button>
            </span>
          </div>
          <Button
            className="react submit-btn"
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
    const { node } = this.props;
    if (!node || !node.node) {
      return null;
    }

    return (
      <ExtensionEditorContainer>
        <h1>Extension Editor </h1>
        {this.renderForm(node)}
      </ExtensionEditorContainer>
    );
  }
}
