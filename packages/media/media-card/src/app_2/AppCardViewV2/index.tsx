/*

  This is a temporary class for compatibility and maps the Fabric DocumentFormat to the new ViewModel,
  until we are confident that this is the right API to support both the DocumentFormat and the
  MediaServices Smart-Card API, and require integrators to update their integrations. Then, this
  class will then be removed and integrators should use the new views directly and maintain any
  necessary mapping to their selected data source themselves.

*/

import * as React from 'react';
export * from '../../app/model';
import {
  AppCardModel as OldViewModel,
  AppCardUser as OldUserViewModel,
  OnActionClickCallback,
} from '../../app/model';
import { BlockCard } from '@atlaskit/media-ui';
import { AppCardView } from '../../app/components/AppCardView';
import { v4 } from 'uuid';

export type AppCardProps = BlockCard.ResolvedViewProps;

function convertUser(oldUser: OldUserViewModel) {
  return {
    icon: oldUser.icon.url,
    name: oldUser.icon.label,
  };
}

function getContext(oldViewModel: OldViewModel) {
  if (!oldViewModel.context) {
    return undefined;
  }
  return {
    icon: oldViewModel.context.icon ? oldViewModel.context.icon.url : undefined,
    text: oldViewModel.context.text,
  };
}

function getHref(oldViewModel: OldViewModel) {
  if (!oldViewModel.link) {
    return undefined;
  }
  return oldViewModel.link.url;
}

function getTitle(oldViewModel: OldViewModel) {
  if (!oldViewModel.title) {
    return undefined;
  }
  return {
    text: oldViewModel.title.text,
  };
}

function getDescription(oldViewModel: OldViewModel) {
  if (!oldViewModel.description) {
    return undefined;
  }
  return {
    text: oldViewModel.description.text,
  };
}

function getPreview(oldViewModel: OldViewModel) {
  if (!oldViewModel.preview) {
    return undefined;
  }
  return oldViewModel.preview.url;
}

function getUser(oldViewModel: OldViewModel) {
  if (!oldViewModel.title || !oldViewModel.title.user) {
    return undefined;
  }
  return {
    icon: oldViewModel.title.user.icon.url,
    name: oldViewModel.title.user.icon.label,
  };
}

function getUsers(oldViewModel: OldViewModel) {
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

function getDetails(oldViewModel: OldViewModel) {
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
  oldViewModel: OldViewModel,
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

export function convertAppCardToSmartCard(model: OldViewModel): AppCardProps {
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

export interface AppCardViewV2Props {
  newDesign?: boolean;
  model: OldViewModel;
  onClick?: () => void;
  onActionClick?: OnActionClickCallback;
}

class AppCardViewV2 extends React.Component<AppCardViewV2Props> {
  render() {
    const { newDesign, model, onClick, onActionClick } = this.props;
    if (newDesign) {
      return (
        <BlockCard.ResolvedView
          {...convertAppCardToSmartCard(model)}
          onClick={onClick}
          actions={getActions(model, onActionClick)}
        />
      );
    } else {
      return (
        <AppCardView
          model={model}
          onClick={onClick}
          onActionClick={onActionClick}
        />
      );
    }
  }
}

// export the new class as the old class
export { AppCardViewV2 as AppCardView };
export { OldViewModel as AppCardModel };
