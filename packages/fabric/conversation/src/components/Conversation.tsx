import * as React from 'react';
import * as PropTypes from 'prop-types';
import Comment from './Comment';
import Editor from './Editor';
import { Comment as CommentType } from '../model';
import { ResourceProvider } from '../api/ConversationResource';

export interface Props {
  provider: ResourceProvider;

  id?: string;
  isExpanded?: boolean;
  meta?: {
    [key: string]: any;
  };

  onCancel?: () => void;
}

export interface State {
  id: string;
  comments: CommentType[];
}

export default class Conversation extends React.Component<Props, State> {
  static childContextTypes = {
    userId: PropTypes.string,
    provider: PropTypes.object,
  };

  getChildContext() {
    return {
      userId: 'mock-user',
      provider: this.props.provider,
    };
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      id: props.id || '',
      comments: [],
    };
  }

  async componentDidMount() {
    const { id, provider } = this.props;
    if (id && provider) {
      const conversation = await provider.getConversation(id);
      if (conversation.children) {
        this.setState({
          comments: conversation.children,
        });
      }
    }
  }

  private onSave = async (value: any) => {
    const { provider } = this.props;
    if (!provider) {
      // Missing Provider
      return;
    }

    let { id } = this.state;
    if (!id) {
      // Create a new Conversation if none provided
      const conversation = await this.createConversation();
      id = conversation.id;
    }

    const comment = await this.addComment(id, value);

    this.setState(state => ({
      id,
      comments: [...state.comments, comment],
    }));
  };

  private async createConversation() {
    const { provider, meta } = this.props;
    return await provider.create(meta);
  }

  private async addComment(id: string, doc: any) {
    const { provider } = this.props;
    return await provider.addComment(id, id, doc);
  }

  private renderComments() {
    const { comments, id } = this.state;
    return comments.map(comment => (
      <Comment conversationId={id} key={comment.id} comment={comment} />
    ));
  }

  private onCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  render() {
    const { isExpanded, onCancel, meta } = this.props;
    return (
      <div>
        {this.renderComments()}
        {isExpanded || !meta ? (
          <Editor
            isExpanded={isExpanded}
            onSave={this.onSave}
            onCancel={onCancel && this.onCancel}
          />
        ) : null}
      </div>
    );
  }
}
