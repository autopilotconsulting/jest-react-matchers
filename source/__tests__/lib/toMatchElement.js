import React from 'react';

import ReactMatcherUtils from '../../lib/ReactMatcherUtils.js';
import toMatchElement from '../../lib/toMatchElement.js';

expect.extend({ toMatchElement });

describe('ReactMatchers', () => {
  describe('#toMatchElement', () => {
    let matcherContext = { equals: () => { } };
    let mockElementsMatch;

    beforeEach(() => {
      mockElementsMatch = jest.spyOn(ReactMatcherUtils, 'elementsMatch');
    });

    afterEach(() => {
      mockElementsMatch.mockRestore();
    });

    it('should pass if elements match', () => {
      mockElementsMatch.mockImplementation(() => true);      

      const actual = <div />;
      const expected = <div />;

      expect(actual).toMatchElement(expected);
      expect(mockElementsMatch).toHaveBeenCalledWith(expect.anything(), actual, expected);
    });

    it('should be negatable', () => {
      mockElementsMatch.mockImplementation(() => false)

      const actual = <div />;
      const expected = <span />;

      expect(actual).not.toMatchElement(expected);
      expect(mockElementsMatch).toHaveBeenCalledWith(expect.anything(), actual, expected);
    });

    it('should describe a failed match', () => {
      mockElementsMatch.mockImplementation(() => false)
      const result = toMatchElement.call(matcherContext, <div />, <span />);
      
      expect(result.message).toMatchSnapshot();
    });

    it('should describe a failed negated match', () => {
      mockElementsMatch.mockImplementation(() => true)
      const result = toMatchElement.call(matcherContext, <div />, <div />);
      
      expect(result.message).toMatchSnapshot();
    });
  });
});