import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../apps/Poll/document';

export default function Example() {
  return FullPageExample({ defaultValue: exampleDocument });
}
