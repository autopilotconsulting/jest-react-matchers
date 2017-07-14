import { describeReactElement } from 'describe-react-element';
import ReactMatcherUtils from './ReactMatcherUtils';
import groupArray from './groupArray';

import flatten from 'array-flatten';

function toHaveMatchingChildren(actualElement, ...expectedElements) {
  const actualDescription = describeReactElement(actualElement, 1);
  const children = actualElement.props.children;

  if (typeof(children) === 'undefined') { 
    const message = [
      'Actual element has no children:',
      actualDescription
    ].join("\n");

    return { pass: false, message };
  }

  expectedElements = flatten([expectedElements]);
  const { true: hits, false: misses } = groupArray(expectedElements, (element) => {
    return ReactMatcherUtils.collectionHasMatchForElement(this.equals, children, element);
  });
  
  const isCorrect = this.isNot ? !hits : !misses;
  const result = { pass: isCorrect && !this.isNot };

  if (isCorrect) { return result; }

  const describeExpected = (element) => describeReactElement(element, 1);
  if (this.isNot) {
    const hitDescriptions = hits.map(describeExpected);

    result.message = [
      'Expected not to find children:',
      ...hitDescriptions,
      '',
      'in:',
      actualDescription,
    ].join("\n");
  } else {
    const missDescriptions = misses.map(describeExpected);

    result.message = [
      'Expected to find children:',
      ...missDescriptions,
      '',
      'in:',
      actualDescription,
    ].join("\n");
  }

  return result;
};

export default toHaveMatchingChildren;