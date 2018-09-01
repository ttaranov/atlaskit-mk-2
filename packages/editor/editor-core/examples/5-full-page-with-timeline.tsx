import { default as FullPageExample } from './5-full-page';
import { exampleDocument } from '../example-helpers/timeline-document';

export default function Example() {
  return FullPageExample({ defaultValue: exampleDocument });
}
