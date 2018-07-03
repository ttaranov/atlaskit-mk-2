import * as React from 'react';
export * from './model';
import {
  AppCardModel,
  AppCardUser as OldUserViewModel,
  OnActionClickCallback,
} from './model';
import { BlockCard } from '@atlaskit/media-ui';
import { v4 } from 'uuid';

export type AppCardProps = BlockCard.ResolvedViewProps;

function convertUser(oldUser: OldUserViewModel) {
  return {
    icon: oldUser.icon.url,
    name: oldUser.icon.label,
  };
}

function getContext(oldViewModel: AppCardModel) {
  if (!oldViewModel.context) {
    return undefined;
  }
  return {
    icon: oldViewModel.context.icon ? oldViewModel.context.icon.url : undefined,
    text: oldViewModel.context.text,
  };
}

function getHref(oldViewModel: AppCardModel) {
  if (!oldViewModel.link) {
    return undefined;
  }
  return oldViewModel.link.url;
}

function getTitle(oldViewModel: AppCardModel) {
  if (!oldViewModel.title) {
    return undefined;
  }
  return {
    text: oldViewModel.title.text,
  };
}

function getDescription(oldViewModel: AppCardModel) {
  if (!oldViewModel.description) {
    return undefined;
  }
  return {
    text: oldViewModel.description.text,
  };
}

function getPreview(oldViewModel: AppCardModel) {
  if (!oldViewModel.preview) {
    return undefined;
  }
  return oldViewModel.preview.url;
}

function getUser(oldViewModel: AppCardModel) {
  if (!oldViewModel.title || !oldViewModel.title.user) {
    return undefined;
  }
  return {
    icon: oldViewModel.title.user.icon.url,
    name: oldViewModel.title.user.icon.label,
  };
}

function getUsers(oldViewModel: AppCardModel) {
  if (!oldViewModel.details) {
    return undefined;
  }
  return oldViewModel.details.reduce((users, oldDetail) => {
    if (oldDetail.users) {
      return [...users, ...oldDetail.users.map(convertUser)];
    } else {
      return users;
    }
  }, []);
}

function getDetails(oldViewModel: AppCardModel) {
  if (!oldViewModel.details) {
    return undefined;
  }
  return oldViewModel.details.map(oldDetail => ({
    title: oldDetail.title,
    icon: oldDetail.icon ? oldDetail.icon.url : undefined,
    badge: oldDetail.badge,
    lozenge: oldDetail.lozenge,
    text: oldDetail.text,
  }));
}

function getActions(
  oldViewModel: AppCardModel,
  onActionClick?: OnActionClickCallback,
) {
  if (!oldViewModel.actions) {
    return undefined;
  }
  return oldViewModel.actions.map(oldAction => {
    return {
      id: v4(),
      text: oldAction.title,
      handler: actionCallbackHandlers => {
        if (onActionClick) {
          onActionClick(oldAction, {
            progress: actionCallbackHandlers.pending,
            success: (message?: string) =>
              actionCallbackHandlers.success(message),
            failure: (
              message?: string,
              tryAgain?: boolean,
              tryAgainLinkText?: string,
            ) => actionCallbackHandlers.failure(),
          });
        }
      },
    };
  });
}

export function convertAppCardToSmartCard(model: AppCardModel): AppCardProps {
  return {
    context: getContext(model),
    link: getHref(model),
    title: getTitle(model),
    description: getDescription(model),
    user: getUser(model),
    users: getUsers(model),
    preview: getPreview(model),
    details: getDetails(model),
  };
}

export interface AppCardViewProps {
  model: AppCardModel;
  onClick?: () => void;
  onActionClick?: OnActionClickCallback;
}

class AppCardView extends React.Component<AppCardViewProps> {
  render() {
    const { model, onClick, onActionClick } = this.props;
    return (
      <BlockCard.ResolvedView
        {...convertAppCardToSmartCard(model)}
        onClick={onClick}
        actions={getActions(model, onActionClick)}
      />
    );
  }
}

// export the new class as the old class
export { AppCardView, AppCardModel };
