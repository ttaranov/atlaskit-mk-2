import Message from '../ui/Appearance/Message';
import FullPage from '../ui/Appearance/FullPage';
import Chromeless from '../ui/Appearance/Chromeless';
import Comment from '../ui/Appearance/Comment';
import Mobile from '../ui/Appearance/Mobile';

import { EditorAppearance, EditorAppearanceComponentProps } from '../types';

export default function getUiComponent(
  appearance: EditorAppearance,
): React.ComponentClass<EditorAppearanceComponentProps> {
  appearance = appearance || 'message';

  switch (appearance) {
    case 'message':
      return Message;
    case 'full-page':
      return FullPage;
    case 'chromeless':
      return Chromeless;
    case 'comment':
      return Comment;
    case 'mobile':
      return Mobile;
    default:
      throw new Error(
        `Appearance '${appearance}' is not supported by the editor.`,
      );
  }
}
