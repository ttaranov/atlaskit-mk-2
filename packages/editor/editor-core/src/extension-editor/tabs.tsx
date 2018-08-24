import * as React from 'react';
import { ExtensionEditorContainer } from './styles';
import FieldText from '@atlaskit/field-text';
import { FormWrapper } from './styles';
import { setNodeSelection } from '../utils';
import { resolveMacro } from '../plugins/macro/actions';
import Button from '@atlaskit/button';
import { replaceSelectedNode, isNodeSelection } from 'prosemirror-utils';
import { pluginKey } from '../plugins/extension/plugin';
import Form, { Field, FormHeader } from '@atlaskit/form';
import { generateUuid } from '@atlaskit/editor-common';

type Parameters = {
  tabs: Array<{
    id: string;
    name: string;
  }>;
  tabsContent: Array<{
    tabId: string;
    content: any;
  }>;
};

export interface Props {
  node: Object;
  view: any;
  params: Parameters;
}

export interface State {
  node: Object;
  params: Parameters;
  nodePos: number;
}

export class Tabs extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const node = props.view.state.doc.nodeAt(props.node.pos);
    this.state = {
      ...props,
      nodePos: props.node && props.node.pos,
      params: node && node.attrs.parameters,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.node.node !== nextProps.node.node) {
      this.setState(prev => {
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

  saveExtension = () => {
    const { view } = this.props;
    const { dispatch } = view;
    const node = view.state.doc.nodeAt(this.props.node.pos);

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
    if (newNode) {
      dispatch(replaceSelectedNode(newNode)(view.state.tr));
    }
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
        <>
          <Field key={idx} id={item.id} label={`Option ${idx + 1}`} isRequired>
            <FieldText
              name="tab_name"
              onChange={this.updateInput.bind(null, item.id)}
              shouldFitContainer
              value={item.name}
              onBlur={this.saveExtension}
            />
          </Field>
          {idx > 1 && (
            <Button
              className="react remove-option"
              appearance="link"
              onClick={() => this.removeOption(item.id)}
            >
              Remove
            </Button>
          )}
        </>
      );
    });
  }

  addOption = e => {
    const node = this.props.view.state.doc.nodeAt(this.props.node.pos);
    const params = node.attrs.parameters;
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
      this.saveExtension();
    });
  };

  removeOption = tabId => {
    this.setState(
      prevState => ({
        params: {
          tabs: prevState.params.tabs.filter(i => i.id !== tabId),
          tabsContent: prevState.params.tabsContent.filter(
            i => i.tabId !== tabId,
          ),
        },
      }),
      () => {
        this.saveExtension();
      },
    );
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
          <div className="options" onBlur={this.saveExtension}>
            {this.renderTabs(parameters)}
          </div>
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
    const { node } = this.props;
    if (!node || !node.node) {
      return null;
    }

    return (
      <ExtensionEditorContainer>
        {this.renderForm(node)}
      </ExtensionEditorContainer>
    );
  }
}
