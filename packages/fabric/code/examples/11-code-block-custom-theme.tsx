import * as React from 'react';
import { AkCodeBlock } from '../src';
import {
  akColorN50,
  akColorN90,
  akColorN400,
  akColorN600,
  akColorG200,
  akColorB100,
  akColorR100,
  akColorT300,
  akColorT500,
  akColorP75,
} from '@atlaskit/util-shared-styles';

const exampleCodeBlock = `// Create a map.
final IntIntOpenHashMap map = new IntIntOpenHashMap();
map.put(1, 2);
map.put(2, 5);
map.put(3, 10);

int count = map.forEach(new IntIntProcedure()
{
   int count;
   public void apply(int key, int value)
   {
       if (value >= 5) count++;
   }
}).count;
System.out.println("There are " + count + " values >= 5");`;

const theme = {
  lineNumberColor: akColorN90,
  lineNumberBgColor: akColorN600,
  backgroundColor: akColorN400,
  textColor: akColorN50,
  substringColor: akColorN400,
  keywordColor: akColorP75,
  attributeColor: akColorT500,
  selectorTagColor: akColorP75,
  nameColor: akColorP75,
  builtInColor: akColorP75,
  literalColor: akColorP75,
  bulletColor: akColorP75,
  codeColor: akColorP75,
  additionColor: akColorP75,
  regexpColor: akColorT300,
  symbolColor: akColorT300,
  variableColor: akColorT300,
  templateVariableColor: akColorT300,
  linkColor: akColorB100,
  selectorAttributeColor: akColorT300,
  selectorPseudoColor: akColorT300,
  typeColor: akColorT500,
  stringColor: akColorG200,
  selectorIdColor: akColorT500,
  selectorClassColor: akColorT500,
  quoteColor: akColorT500,
  templateTagColor: akColorT500,
  deletionColor: akColorT500,
  titleColor: akColorR100,
  sectionColor: akColorR100,
  commentColor: akColorN90,
  metaKeywordColor: akColorG200,
  metaColor: akColorN400,
  functionColor: akColorG200,
  numberColor: akColorB100,
};

export default function Component() {
  return <AkCodeBlock language="java" text={exampleCodeBlock} theme={theme} />;
}
