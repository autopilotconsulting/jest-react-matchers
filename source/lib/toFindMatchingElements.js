import { describeReactElement } from 'describe-react-element';
import ReactMatcherUtils from './ReactMatcherUtils';
import groupArray from './groupArray';

import flatten from 'array-flatten';

function toFindMatchingElements(actualElement, ...expectedElements) {
  const actualDescription = describeReactElement(actualElement, 1);

  expectedElements = flatten([expectedElements]);
  const { true: hits, false: misses } = groupArray(expectedElements, (expectedElement) => {
    let matches = ReactMatcherUtils.findMatchingElement(this.equals, actualElement, expectedElement);
    matches = flatten([matches]).filter(element => element);
    return matches.length > 0;
  });

  const isCorrect = this.isNot ? !hits : !misses;
  const result = { pass: isCorrect != this.isNot };

  if (isCorrect) { return result; }

  const describeExpected = (element) => describeReactElement(element, 1);
  if (this.isNot) {
    const hitDescriptions = hits.map(describeExpected);

    result.message = () => [
      'The following unexpected elements were found:',
      ...hitDescriptions,
      '',
      'in:',
      actualDescription,
    ].join("\n");
  } else {
    const missDescriptions = misses.map(describeExpected);

    result.message = () => [
      'The following elements were not found:',
      ...missDescriptions,
      '',
      'in:',
      actualDescription,
    ].join("\n");
  }

  return result;
};

export default toFindMatchingElements;