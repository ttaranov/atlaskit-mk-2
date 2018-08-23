import * as React from 'react';
import { ExtensionEditorContainer } from './styles';
import FieldText from '@atlaskit/field-text';
import { FormWrapper } from './styles';
import { resolveMacro } from '../plugins/macro/actions';
import { replaceSelectedNode } from 'prosemirror-utils';
import Button from '@atlaskit/button';
import * as format from 'date-fns/format';
import * as parse from 'date-fns/parse';

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

export class Rsvp extends React.Component<Props, State> {
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
      } as any,
      this.props.view.state,
    );

    console.log(newNode);
    dispatch(replaceSelectedNode(newNode)(state.tr));
  };

  renderOptions(params) {
    const {
      dateTime,
      deadline,
      duration,
      location,
      maxAttendees,
      showMap,
    } = this.state.params;
    const x = format;
    const y = parse;
    console.log(x(dateTime, 'YYYY-MM-DDTHH:mm:ss'));
    // console.log
    return (
      <>
        <Field label="Date" isRequired>
          <FieldText
            type="datetime-local"
            name="evt_date"
            shouldFitContainer
            onBlur={this.saveExtension}
            value={format(dateTime, 'YYYY-MM-DDTHH:mm:ss')}
            onChange={e => {
              this.setState({
                params: {
                  ...this.state.params,
                  dateTime: e.target.value,
                },
              });
            }}
          />
        </Field>
        <Field label="Deadline" isRequired>
          <FieldText
            name="evt_deadline"
            type="datetime-local"
            shouldFitContainer
            onBlur={this.saveExtension}
            value={format(deadline, 'YYYY-MM-DDTHH:mm:ss')}
            onChange={e => {
              this.setState({
                params: {
                  ...this.state.params,
                  deadline: parse(e.target.value),
                },
              });
            }}
          />
        </Field>
        <Field label="Event Duration" isRequired>
          <FieldText
            name="evt_duration"
            shouldFitContainer
            onBlur={this.saveExtension}
            value={duration}
            onChange={e => {
              this.setState({
                params: {
                  ...this.state.params,
                  duration: e.target.value,
                },
              });
            }}
          />
        </Field>
        <Field label="location" isRequired>
          <FieldText
            name="ext_location"
            shouldFitContainer
            onBlur={this.saveExtension}
            value={location}
            onChange={e =>
              this.setState({
                params: {
                  ...this.state.params,
                  location: e.target.value,
                },
              })
            }
          />
        </Field>
        <Field label="Max Attendees" isRequired>
          <FieldText
            name="ext_attendees"
            shouldFitContainer
            onBlur={this.saveExtension}
            value={maxAttendees}
            onChange={e =>
              this.setState({
                params: {
                  ...this.state.params,
                  maxAttendees: e.target.value,
                },
              })
            }
          />
        </Field>
      </>
    );
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
          <Field label="Description" isRequired>
            <FieldText
              name="ext_name"
              shouldFitContainer
              value={parameters.title}
            />
          </Field>
          <div>{this.renderOptions(parameters)}</div>
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
