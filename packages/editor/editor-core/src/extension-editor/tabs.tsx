import * as React from 'react';
import { ExtensionEditorContainer } from './styles';
import FieldText from '@atlaskit/field-text';
import { FormWrapper } from './styles';
import { setNodeSelection } from '../utils';
import { resolveMacro } from '../plugins/macro/actions';
import Button from '@atlaskit/button';
import { replaceParentNodeOfType } from 'prosemirror-utils';

import Form, { Field, FormHeader } from '@atlaskit/form';

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

const dummyTab =
  '[{"type":"paragraph","content":[{"type":"text","text":"P1"}]}]';

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
    const { dispatch, state } = this.props.view;
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
      this.props.view.state,
    );

    dispatch(
      replaceParentNodeOfType(state.schema.nodes.bodiedExtension, newNode)(
        state.tr,
      ),
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
    // e.preventDefault();
    // e.stopPropagation();
    this.setState(
      {
        params: {
          ...this.state.params,
          tabs: [...this.state.params.tabs, []],
          tabsContent: [
            ...this.state.params.tabsContent,
            { id: this.state.params.tabs.length + 1, content: dummyTab },
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
    this.setState(prev => ({
      params: {
        ...prev.params,
        tabs: prev.params.tabs.map((item, idx) => {
          if (item.id === key) {
            return {
              id: item.id,
              name: e.target.value,
            };
          }
          return item;
        }),
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
        <Form
          name="edit-extension"
          target="submitEdit"
          onSubmit={this.saveExtension}
        >
          <FormHeader title={extensionKey} />
          <div className="options">{this.renderTabs(parameters)}</div>
          <div>
            <span className="add-option">
              <a className="react" onClick={this.addOption}>
                + Add option
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
