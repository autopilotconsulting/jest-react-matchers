import JestReactMatchers from '../index';

import toMatchElement from '../lib/toMatchElement';
import toHaveMatchingChildren from '../lib/toHaveMatchingChildren';

it('should export the matchers object', () => {
  const expectedMatchers = {
    toMatchElement, toHaveMatchingChildren
  };

  expect(JestReactMatchers).toEqual(expectedMatchers);
});