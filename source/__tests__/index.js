import JestReactMatchers from '../index';

import toMatchElement from '../lib/toMatchElement';

it('should export the matchers object', () => {
  const expectedMatchers = {
    toMatchElement
  };

  expect(JestReactMatchers).toEqual(expectedMatchers);
});