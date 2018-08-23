import * as React from 'react';
import { ExtensionEditorContainer } from './styles';
import FieldText from '@atlaskit/field-text';
import { FormWrapper } from './styles';
import { setNodeSelection } from '../utils';
import { resolveMacro } from '../plugins/macro/actions';
import Button from '@atlaskit/button';
import {
  replaceParentNodeOfType,
  replaceSelectedNode,
  isNodeSelection,
} from 'prosemirror-utils';
import { pluginKey } from '../plugins/extension/plugin';
import Form, { Field, FormHeader } from '@atlaskit/form';
import { generateUuid } from '@atlaskit/editor-common';

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

export class Tabs extends React.Component<Props, State> {
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
      this.props.node.node !== nextProps.node.node
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
    const { view } = this.props;
    const { dispatch } = view;
    const { node } = this.props.node;

    const newNode = resolveMacro(
      {
        type: node.type.name,
        attrs: {
          ...node.attrs,
          parameters: this.state.params,
        },
        content: node && node.content.toJSON(),
      } as any,
      view.state,
    );
    if (!isNodeSelection(view.state.selection)) {
      setNodeSelection(view, this.state.nodePos);
    }
    dispatch(replaceSelectedNode(newNode)(view.state.tr));
  };

  dismiss = () => {
    const { dispatch, state } = this.props.view;
    dispatch(
      state.tr.setMeta(pluginKey, {
        showSidebar: false,
      }),
    );
  };

  renderTabs(params) {
    return this.state.params.tabs.map((item, idx) => {
      return (
        <Field id={item.id} label={`Option ${idx + 1}`} isRequired>
          <FieldText
            name="tab_name"
            onChange={this.updateInput.bind(null, item.id)}
            shouldFitContainer
            value={item.name}
            onBlur={this.saveExtension}
          />
        </Field>
      );
    });
  }

  addOption = e => {
    const { params } = this.state;
    const newTabId = `${generateUuid()}`;
    const nextState = {
      params: {
        ...params,
        tabs: [
          ...params.tabs,
          {
            id: newTabId,
            name: 'New tab',
          },
        ],
        tabsContent: [
          ...params.tabsContent,
          {
            tabId: newTabId,
            content: [{ type: 'paragraph', content: [] }],
          },
        ],
      },
    };

    this.setState(nextState, () => {
      setNodeSelection(this.props.view, this.state.nodePos);
      this.saveExtension();
    });
  };

  updateInput = (key, e) => {
    e.persist();
    const { params } = this.state;
    const nextState = {
      params: {
        ...params,
        tabs: params.tabs.map((item, idx) => {
          if (item.id === key) {
            return {
              id: item.id,
              name: e.target.value,
            };
          }
          return item;
        }),
      },
    };
    this.setState(nextState);
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
          <div className="options">{this.renderTabs(parameters)}</div>
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
            onClick={() => {
              this.saveExtension();
              this.dismiss();
            }}
          >
            Save
          </Button>
        </Form>
      </FormWrapper>
    );
  }

  render() {
    const { showSidebar, node } = this.state;
    if (!showSidebar || !node.node) {
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
