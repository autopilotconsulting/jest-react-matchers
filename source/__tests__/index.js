import JestReactMatchers from '../index';

import toMatchElement from '../lib/toMatchElement';
import toHaveMatchingChildren from '../lib/toHaveMatchingChildren';
import toFindMatchingElements from '../lib/toFindMatchingElements';

it('should export the matchers object', () => {
  const expectedMatchers = {
    toMatchElement, toHaveMatchingChildren, toFindMatchingElements
  };

  expect(JestReactMatchers).toEqual(expectedMatchers);
});