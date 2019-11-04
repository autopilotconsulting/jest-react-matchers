import { describeReactElement } from 'describe-react-element';
import ReactMatcherUtils from './ReactMatcherUtils';

function toMatchElement(actualElement, expectedElement) {
  const result = { pass: ReactMatcherUtils.elementsMatch(this.equals, actualElement, expectedElement) };

  const actualDescription = describeReactElement(actualElement);
  const expectedDescription = describeReactElement(expectedElement);

  if (result.pass) {
    result.message = () => [
      'Expected element:',
      actualDescription,
      '',
      'not to match:',
      expectedDescription,
      '',
      'but it did!!',
    ].join("\n");
  } else {
    result.message = () => [
      'Expected element:',
      actualDescription,
      '',
      'To match:',
      expectedDescription
    ].join("\n");
  }

  return result;
}

export default toMatchElement;